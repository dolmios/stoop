use std::collections::HashMap;
use crate::config::StoopConfig;
use crate::types::{StyleExtraction, StyleValue, StylePart, CSSOutput};
use crate::hasher::ClassNameHasher;
use crate::tokens::TokenResolver;

const BASE_INDENT: usize = 2;
const NESTED_INDENT: usize = 4;

pub struct CSSGenerator {
    config: StoopConfig,
    hasher: ClassNameHasher,
    token_resolver: TokenResolver,
}

impl CSSGenerator {
    pub fn new(config: &StoopConfig) -> Self {
        Self {
            hasher: ClassNameHasher::new(),
            token_resolver: TokenResolver::new(&config.theme),
            config: config.clone(),
        }
    }

    pub fn generate(&self, extraction: &StyleExtraction) -> CSSOutput {
        let mut output = CSSOutput {
            base_class: String::new(),
            selector_class: String::new(),
            variant_classes: HashMap::new(),
            css: String::new(),
        };

        if !extraction.base_styles.is_empty() || !extraction.nested_selectors.is_empty() {
            output.base_class = self.hasher.hash_styles(
                &extraction.component_name,
                "base",
                &extraction.base_styles,
            );

            output.base_class = format!("{}-{}", self.config.prefix, output.base_class);

            // Generate selector class (same hash as base_class for component targeting)
            output.selector_class = output.base_class.clone();

            let base_css = self.generate_base_rule(
                &output.base_class,
                &extraction.base_styles,
                &extraction.nested_selectors,
            );

            output.css.push_str(&base_css);
            output.css.push('\n');
        }

        for (variant_name, variant_values) in &extraction.variants {
            let mut variant_class_map = HashMap::new();

            for (value_name, styles) in variant_values {
                let class_name = self.hasher.hash_styles(
                    &extraction.component_name,
                    &format!("{}-{}", variant_name, value_name),
                    styles,
                );

                let full_class_name = format!("{}-{}", self.config.prefix, class_name);
                let variant_css = self.generate_rule(&full_class_name, styles);

                output.css.push_str(&variant_css);
                output.css.push('\n');

                variant_class_map.insert(value_name.clone(), full_class_name);
            }

            output.variant_classes.insert(variant_name.clone(), variant_class_map);
        }

        output
    }

    fn generate_base_rule(
        &self,
        class_name: &str,
        base_styles: &HashMap<String, StyleValue>,
        nested_selectors: &HashMap<String, HashMap<String, StyleValue>>,
    ) -> String {
        let mut css = String::new();

        // Generate base styles
        if !base_styles.is_empty() {
            css.push_str(&format!(".{} {{\n", class_name));
            self.write_properties(&mut css, base_styles, BASE_INDENT);
            css.push_str("}\n\n");
        }

        // Generate nested selectors
        for (selector, styles) in nested_selectors {
            if selector.starts_with('@') {
                // Media query - wrap entire rule
                css.push_str(&format!("{} {{\n", selector));
                css.push_str(&format!("  .{} {{\n", class_name));
                self.write_properties(&mut css, styles, NESTED_INDENT);
                css.push_str("  }}\n");
                css.push_str("}}\n\n");
            } else {
                let full_selector = self.build_nested_selector(class_name, selector);
                css.push_str(&format!("{} {{\n", full_selector));
                self.write_properties(&mut css, styles, BASE_INDENT);
                css.push_str("}\n\n");
            }
        }

        css
    }

    fn write_properties(
        &self,
        css: &mut String,
        styles: &HashMap<String, StyleValue>,
        indent: usize,
    ) {
        let indent_str = " ".repeat(indent);
        for (prop, value) in styles {
            let css_prop = self.js_to_css_property(prop);
            let css_value = self.style_value_to_css(value, prop);
            css.push_str(&format!("{}{}: {};\n", indent_str, css_prop, css_value));
        }
    }

    fn generate_rule(
        &self,
        class_name: &str,
        styles: &HashMap<String, StyleValue>,
    ) -> String {
        let mut rule = format!(".{} {{\n", class_name);
        self.write_properties(&mut rule, styles, BASE_INDENT);
        rule.push_str("}\n");
        rule
    }

    fn build_nested_selector(&self, base_class: &str, selector: &str) -> String {
        // Note: Media queries are handled separately in generate_base_rule
        match selector.chars().next() {
            Some('&') => selector.replacen('&', &format!(".{}", base_class), 1),
            Some(':') => format!(".{}{}", base_class, selector),
            _ => format!(".{} {}", base_class, selector),
        }
    }

    fn js_to_css_property(&self, prop: &str) -> String {
        let mut result = String::new();

        for (i, ch) in prop.chars().enumerate() {
            if ch.is_uppercase() {
                if i > 0 {
                    result.push('-');
                }
                result.push(ch.to_lowercase().next().unwrap());
            } else {
                result.push(ch);
            }
        }

        result
    }

    fn style_value_to_css(&self, value: &StyleValue, property: &str) -> String {
        match value {
            StyleValue::Static(s) => s.clone(),
            StyleValue::Token(token) => {
                self.token_resolver.resolve(token, property)
            }
            StyleValue::Compound(parts) => {
                let mut result = String::new();

                for part in parts {
                    match part {
                        StylePart::Static(s) => result.push_str(s),
                        StylePart::Token(token) => {
                            let resolved = self.token_resolver.resolve(token, property);
                            result.push_str(&resolved);
                        }
                    }
                }

                result
            }
        }
    }
}
