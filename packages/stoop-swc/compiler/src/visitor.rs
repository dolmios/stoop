use swc_core::ecma::{
    ast::*,
    visit::{VisitMut, VisitMutWith},
};
use swc_core::common::{DUMMY_SP, SyntaxContext};

use crate::config::StoopConfig;
use crate::extractor::StyleExtractor;
use crate::generator::CSSGenerator;
use crate::transformer::ComponentTransformer;
use crate::writer::StyleWriter;

pub struct StoopVisitor {
    config: StoopConfig,
    styled_identifiers: Vec<String>,
    extractor: StyleExtractor,
    generator: CSSGenerator,
    transformer: ComponentTransformer,
    writer: StyleWriter,
    needs_react_imports: bool,
    needs_clsx_import: bool,
}

impl StoopVisitor {
    pub fn new(config: StoopConfig) -> Self {
        Self {
            extractor: StyleExtractor::new(&config),
            generator: CSSGenerator::new(&config),
            transformer: ComponentTransformer::new(&config),
            writer: StyleWriter::new(&config),
            styled_identifiers: vec!["styled".to_string()],
            needs_react_imports: false,
            needs_clsx_import: false,
            config,
        }
    }

    pub fn finalize(&mut self) {
        self.writer.write_all();
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

        // Check if stoop-swc/runtime imports exist
        let has_runtime_import = module.body.iter().any(|item| {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
                import.src.value == "stoop-swc/runtime"
            } else {
                false
            }
        });

        if self.needs_clsx_import && !has_runtime_import {
            // Create new stoop-swc/runtime import with clsx and createSelector
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
                    value: "stoop-swc/runtime".into(),
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
                    self.writer.register_styles(&css_output);
                    let new_init = self.transformer.create_component(&extraction, &css_output);

                    // Mark that we need React imports and clsx
                    self.needs_react_imports = true;
                    self.needs_clsx_import = true;

                    decl.init = Some(Box::new(Expr::from(new_init)));
                }
            }
        }
    }
}

impl VisitMut for StoopVisitor {
    fn visit_mut_module(&mut self, module: &mut swc_core::ecma::ast::Module) {
        module.visit_mut_children_with(self);
        self.ensure_imports(module);
    }

    fn visit_mut_import_decl(&mut self, import: &mut ImportDecl) {
        if import.src.value != "stoop-swc/runtime" {
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
                    }
                }
                _ => {}
            }
        }

        import.visit_mut_children_with(self);
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
}
