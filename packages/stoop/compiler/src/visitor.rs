use swc_core::ecma::{
    ast::*,
    visit::{VisitMut, VisitMutWith},
};
use swc_core::common::{DUMMY_SP, SyntaxContext};

use crate::config::StoopConfig;
use crate::emitter::CSSEmitter;
use crate::extractor::StyleExtractor;
use crate::generator::CSSGenerator;
use crate::hasher::{hash_atomic, hash_string, to_kebab_case};
use crate::transformer::ComponentTransformer;
use crate::types::{AtomicCSSOutput, AtomicRule};

pub struct StoopVisitor {
    styled_identifiers: Vec<String>,
    css_identifiers: Vec<String>,
    global_css_identifiers: Vec<String>,
    keyframes_identifiers: Vec<String>,
    extractor: StyleExtractor,
    generator: CSSGenerator,
    transformer: ComponentTransformer,
    emitter: CSSEmitter,
    prefix: String,
    needs_react_imports: bool,
    needs_clsx_import: bool,
}

impl StoopVisitor {
    pub fn new(config: StoopConfig) -> Self {
        let prefix = config.prefix.clone();
        Self {
            extractor: StyleExtractor::new(&config),
            generator: CSSGenerator::new(&config),
            transformer: ComponentTransformer::new(&config),
            emitter: CSSEmitter::new(),
            prefix,
            styled_identifiers: vec!["styled".to_string()],
            css_identifiers: vec!["css".to_string()],
            global_css_identifiers: vec!["globalCss".to_string()],
            keyframes_identifiers: vec!["keyframes".to_string()],
            needs_react_imports: false,
            needs_clsx_import: false,
        }
    }

    fn ensure_imports(&mut self, module: &mut swc_core::ecma::ast::Module) {
        let mut imports_to_add = Vec::new();

        // Check if React is already imported
        let has_react = module.body.iter().any(|item| {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
                import.src.value == "react"
            } else {
                false
            }
        });

        if self.needs_react_imports && !has_react {
            // Add React import with forwardRef and createElement
            imports_to_add.push(ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                span: DUMMY_SP,
                specifiers: vec![
                    ImportSpecifier::Named(ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: Ident::new("forwardRef".into(), DUMMY_SP, SyntaxContext::empty()),
                        imported: Some(ModuleExportName::Ident(Ident::new("forwardRef".into(), DUMMY_SP, SyntaxContext::empty()))),
                        is_type_only: false,
                    }),
                    ImportSpecifier::Named(ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: Ident::new("createElement".into(), DUMMY_SP, SyntaxContext::empty()),
                        imported: Some(ModuleExportName::Ident(Ident::new("createElement".into(), DUMMY_SP, SyntaxContext::empty()))),
                        is_type_only: false,
                    }),
                ],
                src: Box::new(Str {
                    span: DUMMY_SP,
                    value: "react".into(),
                    raw: None,
                }),
                type_only: false,
                with: None,
                phase: Default::default(),
            })));
        }

        // Check if clsx and createSelector are already imported from stoop
        let has_runtime_helpers = module.body.iter().any(|item| {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
                if import.src.value == "stoop" {
                    return import.specifiers.iter().any(|spec| {
                        if let ImportSpecifier::Named(named) = spec {
                            let name = match &named.imported {
                                Some(ModuleExportName::Ident(id)) => id.sym.to_string(),
                                None => named.local.sym.to_string(),
                                _ => return false,
                            };
                            name == "clsx" || name == "createSelector"
                        } else {
                            false
                        }
                    });
                }
            }
            false
        });

        if self.needs_clsx_import && !has_runtime_helpers {
            // Create new stoop import with clsx and createSelector
            imports_to_add.push(ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                span: DUMMY_SP,
                specifiers: vec![
                    ImportSpecifier::Named(ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: Ident::new("clsx".into(), DUMMY_SP, SyntaxContext::empty()),
                        imported: Some(ModuleExportName::Ident(Ident::new("clsx".into(), DUMMY_SP, SyntaxContext::empty()))),
                        is_type_only: false,
                    }),
                    ImportSpecifier::Named(ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: Ident::new("createSelector".into(), DUMMY_SP, SyntaxContext::empty()),
                        imported: Some(ModuleExportName::Ident(Ident::new("createSelector".into(), DUMMY_SP, SyntaxContext::empty()))),
                        is_type_only: false,
                    }),
                ],
                src: Box::new(Str {
                    span: DUMMY_SP,
                    value: "stoop".into(),
                    raw: None,
                }),
                type_only: false,
                with: None,
                phase: Default::default(),
            })));
        }

        // Insert imports at the beginning
        for import in imports_to_add.into_iter().rev() {
            module.body.insert(0, import);
        }
    }

    fn is_styled_call(&self, call: &CallExpr) -> bool {
        match &call.callee {
            Callee::Expr(expr) => match &**expr {
                Expr::Ident(ident) => {
                    self.styled_identifiers.contains(&ident.sym.to_string())
                }
                _ => false,
            },
            _ => false,
        }
    }

    fn is_css_call(&self, call: &CallExpr) -> bool {
        match &call.callee {
            Callee::Expr(expr) => match &**expr {
                Expr::Ident(ident) => {
                    self.css_identifiers.contains(&ident.sym.to_string())
                }
                _ => false,
            },
            _ => false,
        }
    }

    fn is_global_css_call(&self, call: &CallExpr) -> bool {
        match &call.callee {
            Callee::Expr(expr) => match &**expr {
                Expr::Ident(ident) => {
                    self.global_css_identifiers.contains(&ident.sym.to_string())
                }
                _ => false,
            },
            _ => false,
        }
    }

    fn is_keyframes_call(&self, call: &CallExpr) -> bool {
        match &call.callee {
            Callee::Expr(expr) => match &**expr {
                Expr::Ident(ident) => {
                    self.keyframes_identifiers.contains(&ident.sym.to_string())
                }
                _ => false,
            },
            _ => false,
        }
    }

    fn transform_styled_call(&mut self, decl: &mut VarDeclarator) {
        if let Some(init) = &decl.init {
            if let Expr::Call(call) = &**init {
                if self.is_styled_call(call) {
                    let component_name = match &decl.name {
                        Pat::Ident(ident) => ident.id.sym.to_string(),
                        _ => "Unknown".to_string(),
                    };

                    let extraction = self.extractor.extract_from_call(call, &component_name);
                    let css_output = self.generator.generate(&extraction);

                    // Register all atomic rules with the emitter
                    let all_rules = collect_all_rules(&css_output);
                    let owned_rules: Vec<AtomicRule> = all_rules.into_iter().cloned().collect();
                    self.emitter.register_rules(&owned_rules);

                    let new_init = self.transformer.create_component(&extraction, &css_output);

                    // Mark that we need React imports and clsx
                    self.needs_react_imports = true;
                    self.needs_clsx_import = true;

                    decl.init = Some(Box::new(Expr::from(new_init)));
                }
            }
        }
    }

    /// Extract a flat styles object from an ObjectLit into (camelCase key, string value) pairs.
    fn extract_flat_styles(&self, obj: &ObjectLit) -> Vec<(String, String)> {
        let mut styles = Vec::new();
        for prop in &obj.props {
            if let PropOrSpread::Prop(prop) = prop {
                if let Prop::KeyValue(kv) = &**prop {
                    let key = match &kv.key {
                        PropName::Ident(id) => id.sym.to_string(),
                        PropName::Str(s) => String::from_utf8_lossy(s.value.as_bytes()).into_owned(),
                        _ => continue,
                    };
                    let value = match &*kv.value {
                        Expr::Lit(Lit::Str(s)) => String::from_utf8_lossy(s.value.as_bytes()).into_owned(),
                        Expr::Lit(Lit::Num(n)) => n.value.to_string(),
                        _ => continue,
                    };
                    styles.push((key, value));
                }
            }
        }
        styles
    }

    /// Transform a css() call: extract styles, generate atomic rules, return class name string.
    fn transform_css_call(&mut self, call: &CallExpr) -> Option<Expr> {
        let arg = call.args.first()?;
        let obj = match &*arg.expr {
            Expr::Object(obj) => obj,
            _ => return None,
        };

        let styles = self.extract_flat_styles(obj);
        if styles.is_empty() {
            return Some(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: "".into(),
                raw: None,
            })));
        }

        let mut class_names = Vec::new();

        for (prop, value) in &styles {
            let kebab_prop = to_kebab_case(prop);
            let class_name = hash_atomic(&kebab_prop, value, "", &self.prefix);
            let rule = AtomicRule {
                class_name: class_name.clone(),
                property: kebab_prop,
                value: value.clone(),
                pseudo: None,
                at_rule: None,
                priority: 0,
            };
            self.emitter.register_rules(&[rule]);
            class_names.push(class_name);
        }

        let joined = class_names.join(" ");
        Some(Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: joined.into(),
            raw: None,
        })))
    }

    /// Transform a globalCss() call: extract selector -> styles, register global CSS.
    /// Returns true if the call was handled and should be removed.
    fn transform_global_css_call(&mut self, call: &CallExpr) -> bool {
        let arg = match call.args.first() {
            Some(arg) => arg,
            None => return false,
        };
        let obj = match &*arg.expr {
            Expr::Object(obj) => obj,
            _ => return false,
        };

        for prop in &obj.props {
            if let PropOrSpread::Prop(prop) = prop {
                if let Prop::KeyValue(kv) = &**prop {
                    let selector = match &kv.key {
                        PropName::Ident(id) => id.sym.to_string(),
                        PropName::Str(s) => String::from_utf8_lossy(s.value.as_bytes()).into_owned(),
                        _ => continue,
                    };

                    if let Expr::Object(styles_obj) = &*kv.value {
                        let styles = self.extract_flat_styles(styles_obj);
                        let css_body: String = styles
                            .iter()
                            .map(|(prop, value)| format!("{}:{}", to_kebab_case(prop), value))
                            .collect::<Vec<_>>()
                            .join(";");
                        self.emitter.register_global(&selector, &css_body);
                    }
                }
            }
        }

        true
    }

    /// Transform a keyframes() call: extract keyframe steps, register keyframes CSS,
    /// return the hashed animation name as a string literal.
    fn transform_keyframes_call(&mut self, call: &CallExpr) -> Option<Expr> {
        let arg = call.args.first()?;
        let obj = match &*arg.expr {
            Expr::Object(obj) => obj,
            _ => return None,
        };

        let mut keyframe_body = String::new();

        for prop in &obj.props {
            if let PropOrSpread::Prop(prop) = prop {
                if let Prop::KeyValue(kv) = &**prop {
                    let stop = match &kv.key {
                        PropName::Ident(id) => id.sym.to_string(),
                        PropName::Str(s) => String::from_utf8_lossy(s.value.as_bytes()).into_owned(),
                        _ => continue,
                    };

                    if let Expr::Object(styles_obj) = &*kv.value {
                        let styles = self.extract_flat_styles(styles_obj);
                        let declarations: String = styles
                            .iter()
                            .map(|(prop, value)| format!("{}:{}", to_kebab_case(prop), value))
                            .collect::<Vec<_>>()
                            .join(";");
                        keyframe_body.push_str(&format!("{}{{{}}}", stop, declarations));
                    }
                }
            }
        }

        let animation_name = hash_string(&keyframe_body, &self.prefix);
        self.emitter.register_keyframes(&animation_name, &keyframe_body);

        Some(Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: animation_name.into(),
            raw: None,
        })))
    }

    fn inject_css_metadata(&self, module: &mut swc_core::ecma::ast::Module) {
        if self.emitter.is_empty() {
            return;
        }

        let json_string = self.emitter.to_json();

        let css_const = ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(BindingIdent {
                    id: Ident::new("__stoop_css__".into(), DUMMY_SP, SyntaxContext::empty()),
                    type_ann: None,
                }),
                init: Some(Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: json_string.into(),
                    raw: None,
                })))),
                definite: false,
            }],
        }))));

        module.body.insert(0, css_const);
    }
}

/// Collect all atomic rules from an AtomicCSSOutput, including base, variant, and compound variant rules.
fn collect_all_rules(output: &AtomicCSSOutput) -> Vec<&AtomicRule> {
    let mut rules = Vec::new();
    for rule in &output.base_classes {
        rules.push(rule);
    }
    for variants in output.variant_classes.values() {
        for value_rules in variants.values() {
            for rule in value_rules {
                rules.push(rule);
            }
        }
    }
    for compound in &output.compound_variant_classes {
        for rule in &compound.rules {
            rules.push(rule);
        }
    }
    rules
}

impl VisitMut for StoopVisitor {
    fn visit_mut_module(&mut self, module: &mut swc_core::ecma::ast::Module) {
        module.visit_mut_children_with(self);

        // Inject CSS metadata at the top of the module if there are entries
        self.inject_css_metadata(module);

        self.ensure_imports(module);
    }

    fn visit_mut_import_decl(&mut self, import: &mut ImportDecl) {
        if import.src.value != "stoop" {
            import.visit_mut_children_with(self);
            return;
        }

        for spec in &import.specifiers {
            match spec {
                ImportSpecifier::Named(named) => {
                    let local_name = named.local.sym.to_string();

                    let imported_name = match &named.imported {
                        Some(ModuleExportName::Ident(id)) => id.sym.to_string(),
                        None => local_name.clone(),
                        _ => continue,
                    };

                    if imported_name == "styled" {
                        self.styled_identifiers.push(local_name);
                    } else if imported_name == "css" {
                        self.css_identifiers.push(local_name);
                    } else if imported_name == "globalCss" {
                        self.global_css_identifiers.push(local_name);
                    } else if imported_name == "keyframes" {
                        self.keyframes_identifiers.push(local_name);
                    }
                }
                _ => {}
            }
        }

        import.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        // Visit children first so inner expressions are processed
        expr.visit_mut_children_with(self);

        // Check if this expression is a css() or keyframes() call and replace it
        let replacement = match expr {
            Expr::Call(call) => {
                if self.is_css_call(call) {
                    self.transform_css_call(call)
                } else if self.is_keyframes_call(call) {
                    self.transform_keyframes_call(call)
                } else {
                    None
                }
            }
            _ => None,
        };

        if let Some(new_expr) = replacement {
            *expr = new_expr;
        }
    }

    fn visit_mut_decl(&mut self, decl: &mut Decl) {
        match decl {
            Decl::Var(var_decl) => {
                for declarator in &mut var_decl.decls {
                    self.transform_styled_call(declarator);
                }
                decl.visit_mut_children_with(self);
            }
            _ => {
                decl.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_export_decl(&mut self, export: &mut ExportDecl) {
        match &mut export.decl {
            Decl::Var(var_decl) => {
                for declarator in &mut var_decl.decls {
                    self.transform_styled_call(declarator);
                }
            }
            _ => {}
        }
        export.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, decl: &mut VarDeclarator) {
        self.transform_styled_call(decl);
        decl.visit_mut_children_with(self);
    }

    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        // Handle globalCss() calls at statement level before visiting children
        if let Stmt::Expr(expr_stmt) = stmt {
            if let Expr::Call(call) = &*expr_stmt.expr {
                if self.is_global_css_call(call) {
                    let handled = self.transform_global_css_call(call);
                    if handled {
                        // Replace with an empty statement
                        *stmt = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        return;
                    }
                }
            }
        }

        stmt.visit_mut_children_with(self);
    }
}
