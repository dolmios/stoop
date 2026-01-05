use swc_core::ecma::ast::*;
use std::collections::HashMap;
use crate::config::StoopConfig;
use crate::types::{StyleExtraction, StyleValue, StylePart};
use crate::utils::{is_utility_prop, convert_special_utility};

pub struct StyleExtractor {
    config: StoopConfig,
}

impl StyleExtractor {
    pub fn new(config: &StoopConfig) -> Self {
        Self {
            config: config.clone(),
        }
    }

    pub fn extract_from_call(
        &self,
        call: &CallExpr,
        component_name: &str,
    ) -> StyleExtraction {
        let (element, composed_class) = self.extract_element(call);

        StyleExtraction {
            component_name: component_name.to_string(),
            element,
            base_styles: self.extract_base_styles(call),
            variants: self.extract_variants(call),
            nested_selectors: self.extract_nested_selectors(call),
            composed_component_class: composed_class,
        }
    }

    fn extract_element(&self, call: &CallExpr) -> (String, Option<String>) {
        if let Some(arg) = call.args.first() {
            match &*arg.expr {
                Expr::Lit(Lit::Str(s)) => {
                    // Wtf8Atom -> &Wtf8, need to use lossy conversion
                    return (String::from_utf8_lossy(s.value.as_bytes()).into_owned(), None);
                }
                Expr::Ident(ident) => {
                    // Could be a styled component reference
                    // At build-time, we can't know for sure, but we can check if it's likely
                    // For now, assume it's a component and extract the identifier name
                    // The actual className would need to be resolved at runtime or via type info
                    // For now, return the identifier name and let runtime handle it
                    return (ident.sym.to_string(), None);
                }
                Expr::Member(member) => {
                    // Could be accessing a property like Button.selector
                    // Extract the base identifier
                    if let MemberProp::Ident(prop) = &member.prop {
                        if prop.sym.as_str() == "selector" {
                            if let Expr::Ident(base_ident) = &*member.obj {
                                // This is Button.selector - extract Button's className
                                // At build-time, we can't resolve this, so return the base name
                                return (base_ident.sym.to_string(), None);
                            }
                        }
                    }
                }
                _ => {
                    // Unknown expression type - default to div
                }
            }
        }
        ("div".to_string(), None)
    }

    fn extract_base_styles(&self, call: &CallExpr) -> HashMap<String, StyleValue> {
        let mut styles = HashMap::new();
        let mut utility_props = HashMap::new();

        if call.args.len() < 2 {
            return styles;
        }

        if let Expr::Object(obj) = &*call.args[1].expr {
            for prop in &obj.props {
                if let PropOrSpread::Prop(prop) = prop {
                    if let Prop::KeyValue(kv) = &**prop {
                        let key = self.extract_prop_key(&kv.key);

                        if key.starts_with('&') || key.starts_with(':') || key.starts_with('@') {
                            continue;
                        }

                        let value = self.extract_style_value(&kv.value);

                        // Check if this is a utility prop (mb, mt, px, py, etc.)
                        if is_utility_prop(&key) {
                            utility_props.insert(key, value);
                        } else {
                            styles.insert(key, value);
                        }
                    }
                }
            }
        }

        // Convert utility props to CSS properties and merge into styles
        for (utility, value) in utility_props {
            let converted = convert_special_utility(&utility, value);
            styles.extend(converted);
        }

        styles
    }

    fn extract_nested_selectors(&self, call: &CallExpr) -> HashMap<String, HashMap<String, StyleValue>> {
        let mut nested = HashMap::new();

        if call.args.len() < 2 {
            return nested;
        }

        if let Expr::Object(obj) = &*call.args[1].expr {
            for prop in &obj.props {
                if let PropOrSpread::Prop(prop) = prop {
                    if let Prop::KeyValue(kv) = &**prop {
                        let key = self.extract_prop_key(&kv.key);

                        if !key.starts_with('&') && !key.starts_with(':') && !key.starts_with('@') {
                            continue;
                        }

                        if let Expr::Object(nested_obj) = &*kv.value {
                            let mut nested_styles = HashMap::new();

                            for nested_prop in &nested_obj.props {
                                if let PropOrSpread::Prop(np) = nested_prop {
                                    if let Prop::KeyValue(nkv) = &**np {
                                        let nested_key = self.extract_prop_key(&nkv.key);
                                        let nested_value = self.extract_style_value(&nkv.value);
                                        nested_styles.insert(nested_key, nested_value);
                                    }
                                }
                            }

                            nested.insert(key, nested_styles);
                        }
                    }
                }
            }
        }

        nested
    }

    fn extract_variants(
        &self,
        call: &CallExpr,
    ) -> HashMap<String, HashMap<String, HashMap<String, StyleValue>>> {
        let mut variants = HashMap::new();

        if call.args.len() < 3 {
            return variants;
        }

        if let Expr::Object(obj) = &*call.args[2].expr {
            for prop in &obj.props {
                if let PropOrSpread::Prop(prop) = prop {
                    if let Prop::KeyValue(kv) = &**prop {
                        let variant_name = self.extract_prop_key(&kv.key);

                        if let Expr::Object(variant_obj) = &*kv.value {
                            let mut variant_values = HashMap::new();

                            for variant_prop in &variant_obj.props {
                                if let PropOrSpread::Prop(vp) = variant_prop {
                                    if let Prop::KeyValue(vkv) = &**vp {
                                        let value_name = self.extract_prop_key(&vkv.key);

                                        if let Expr::Object(styles_obj) = &*vkv.value {
                                            let mut styles = HashMap::new();

                                            for style_prop in &styles_obj.props {
                                                if let PropOrSpread::Prop(sp) = style_prop {
                                                    if let Prop::KeyValue(skv) = &**sp {
                                                        let style_key = self.extract_prop_key(&skv.key);
                                                        let style_value = self.extract_style_value(&skv.value);
                                                        styles.insert(style_key, style_value);
                                                    }
                                                }
                                            }

                                            variant_values.insert(value_name, styles);
                                        }
                                    }
                                }
                            }

                            variants.insert(variant_name, variant_values);
                        }
                    }
                }
            }
        }

        variants
    }

    fn extract_prop_key(&self, key: &PropName) -> String {
        match key {
            PropName::Ident(ident) => {
                // Atom -> &str
                (&*ident.sym).to_owned()
            }
            PropName::Str(s) => {
                // Wtf8Atom -> &Wtf8, need to use lossy conversion
                String::from_utf8_lossy(s.value.as_bytes()).into_owned()
            }
            _ => String::new(),
        }
    }

    fn extract_style_value(&self, expr: &Expr) -> StyleValue {
        match expr {
            Expr::Lit(Lit::Str(s)) => {
                // Wtf8Atom -> &Wtf8, need to use lossy conversion
                let value: String = String::from_utf8_lossy(s.value.as_bytes()).into_owned();

                if value.starts_with('$') {
                    StyleValue::Token(value)
                } else if value.contains('$') {
                    self.extract_compound_value(&value)
                } else {
                    StyleValue::Static(value)
                }
            }
            Expr::Lit(Lit::Num(n)) => {
                StyleValue::Static(n.value.to_string())
            }
            Expr::Lit(Lit::Bool(b)) => {
                StyleValue::Static(if b.value { "true".to_string() } else { "false".to_string() })
            }
            _ => StyleValue::Static(String::new()),
        }
    }

    fn extract_compound_value(&self, value: &str) -> StyleValue {
        let mut parts = Vec::new();
        let mut current = String::new();
        let mut in_token = false;

        // Improved token parsing that handles:
        // - Tokens at start: "$md"
        // - Tokens in middle: "calc($md + 10px)"
        // - Multiple tokens: "$md $lg"
        // - Tokens with dots: "$colors.primary"

        let mut chars = value.chars().peekable();

        while let Some(ch) = chars.next() {
            if ch == '$' {
                // Save current static part if any
                if !current.is_empty() {
                    parts.push(StylePart::Static(current.clone()));
                    current.clear();
                }
                in_token = true;
                current.push(ch);
            } else if in_token {
                // Continue token until we hit whitespace, comma, or closing paren
                if ch.is_whitespace() || ch == ',' || ch == ')' {
                    if !current.is_empty() {
                        parts.push(StylePart::Token(current.clone()));
                        current.clear();
                    }
                    in_token = false;
                    current.push(ch);
                } else {
                    current.push(ch);
                }
            } else {
                current.push(ch);
            }
        }

        // Add remaining part
        if !current.is_empty() {
            if in_token {
                parts.push(StylePart::Token(current));
            } else {
                parts.push(StylePart::Static(current));
            }
        }

        StyleValue::Compound(parts)
    }
}
