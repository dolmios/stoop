use std::collections::HashMap;
use crate::config::StoopConfig;
use crate::hasher::{hash_atomic, hash_string, to_kebab_case};
use crate::tokens::TokenResolver;
use crate::types::{
    AtomicCSSOutput, AtomicRule, CompoundVariantOutput,
    StyleExtraction, StylePart, StyleValue,
};

pub struct CSSGenerator {
    token_resolver: TokenResolver,
}

/// Dedup registry key: "property:value:context" where context encodes pseudo/at_rule.
fn dedup_key(property: &str, value: &str, pseudo: &Option<String>, at_rule: &Option<String>) -> String {
    let context = match (pseudo, at_rule) {
        (Some(p), Some(a)) => format!("{}|{}", p, a),
        (Some(p), None) => p.clone(),
        (None, Some(a)) => a.clone(),
        (None, None) => String::new(),
    };
    format!("{}:{}:{}", property, value, context)
}

impl CSSGenerator {
    pub fn new(config: &StoopConfig) -> Self {
        Self {
            token_resolver: TokenResolver::new(&config.theme),
        }
    }

    pub fn generate(&self, extraction: &StyleExtraction) -> AtomicCSSOutput {
        let mut registry: HashMap<String, AtomicRule> = HashMap::new();

        // Generate selector class from component name
        let selector_class = hash_string(&extraction.component_name);

        // --- Base styles ---
        let base_classes = self.process_styles(
            &extraction.base_styles,
            None,
            None,
            &mut registry,
        );

        // --- Nested selectors (pseudo-classes, media queries, combined) ---
        let nested_base = self.process_nested_selectors(
            &extraction.nested_selectors,
            &mut registry,
        );

        let mut all_base_classes = base_classes;
        all_base_classes.extend(nested_base);

        // --- Variants ---
        let mut variant_classes: HashMap<String, HashMap<String, Vec<AtomicRule>>> = HashMap::new();

        let mut sorted_variant_names: Vec<&String> = extraction.variants.keys().collect();
        sorted_variant_names.sort();

        for variant_name in sorted_variant_names {
            let variant_values = &extraction.variants[variant_name];
            let mut value_map: HashMap<String, Vec<AtomicRule>> = HashMap::new();

            let mut sorted_value_names: Vec<&String> = variant_values.keys().collect();
            sorted_value_names.sort();

            for value_name in sorted_value_names {
                let styles = &variant_values[value_name];
                let rules = self.process_styles(styles, None, None, &mut registry);
                value_map.insert(value_name.clone(), rules);
            }

            variant_classes.insert(variant_name.clone(), value_map);
        }

        // --- Compound variants ---
        let mut compound_variant_classes: Vec<CompoundVariantOutput> = Vec::new();

        for cv in &extraction.compound_variants {
            let conditions: Vec<(String, String)> = cv
                .conditions
                .iter()
                .map(|(k, v)| (k.clone(), v.clone()))
                .collect();

            let rules = self.process_styles(&cv.styles, None, None, &mut registry);

            compound_variant_classes.push(CompoundVariantOutput { conditions, rules });
        }

        AtomicCSSOutput {
            base_classes: all_base_classes,
            selector_class,
            variant_classes,
            compound_variant_classes,
            default_variants: extraction.default_variants.clone(),
        }
    }

    /// Process a flat map of styles into atomic rules.
    fn process_styles(
        &self,
        styles: &HashMap<String, StyleValue>,
        pseudo: Option<String>,
        at_rule: Option<String>,
        registry: &mut HashMap<String, AtomicRule>,
    ) -> Vec<AtomicRule> {
        let mut rules = Vec::new();

        let mut sorted_keys: Vec<&String> = styles.keys().collect();
        sorted_keys.sort();

        for prop in sorted_keys {
            let value = &styles[prop];
            let kebab_prop = to_kebab_case(prop);
            let resolved_value = self.resolve_style_value(value, prop);

            let context = self.build_context(&pseudo, &at_rule);
            let class_name = hash_atomic(&kebab_prop, &resolved_value, &context);

            let priority = match (&pseudo, &at_rule) {
                (Some(_), Some(_)) => 3,
                (None, Some(_)) => 2,
                (Some(_), None) => 1,
                (None, None) => 0,
            };

            let key = dedup_key(&kebab_prop, &resolved_value, &pseudo, &at_rule);

            let rule = registry.entry(key).or_insert_with(|| AtomicRule {
                class_name: class_name.clone(),
                property: kebab_prop,
                value: resolved_value,
                pseudo: pseudo.clone(),
                at_rule: at_rule.clone(),
                priority,
            });

            rules.push(rule.clone());
        }

        rules
    }

    /// Process nested selectors (pseudo-classes, media queries, and combinations).
    fn process_nested_selectors(
        &self,
        nested: &HashMap<String, HashMap<String, StyleValue>>,
        registry: &mut HashMap<String, AtomicRule>,
    ) -> Vec<AtomicRule> {
        let mut rules = Vec::new();

        let mut sorted_selectors: Vec<&String> = nested.keys().collect();
        sorted_selectors.sort();

        for selector in sorted_selectors {
            let styles = &nested[selector];
            let (pseudo, at_rule) = self.parse_selector(selector);
            let nested_rules = self.process_styles(styles, pseudo, at_rule, registry);
            rules.extend(nested_rules);
        }

        rules
    }

    /// Parse a nested selector string into (pseudo, at_rule) components.
    fn parse_selector(&self, selector: &str) -> (Option<String>, Option<String>) {
        if selector.starts_with('@') {
            // Pure at-rule, e.g. "@media (min-width: 768px)"
            (None, Some(selector.to_string()))
        } else if selector.starts_with("&:") {
            // Pseudo via &, e.g. "&:hover" -> ":hover"
            let pseudo = &selector[1..]; // strip the '&'
            (Some(pseudo.to_string()), None)
        } else if selector.starts_with(':') {
            // Pseudo directly, e.g. ":hover"
            (Some(selector.to_string()), None)
        } else if selector.starts_with('&') {
            // Other & selectors, treat the part after & as pseudo
            let rest = &selector[1..];
            (Some(rest.to_string()), None)
        } else {
            // Descendant or other selector — treat as pseudo context
            (Some(selector.to_string()), None)
        }
    }

    /// Build the context string for hash_atomic from pseudo and at_rule.
    fn build_context(&self, pseudo: &Option<String>, at_rule: &Option<String>) -> String {
        match (pseudo, at_rule) {
            (Some(p), Some(a)) => format!("{}|{}", p, a),
            (Some(p), None) => p.clone(),
            (None, Some(a)) => a.clone(),
            (None, None) => String::new(),
        }
    }

    /// Resolve a StyleValue to its final CSS string.
    fn resolve_style_value(&self, value: &StyleValue, property: &str) -> String {
        match value {
            StyleValue::Static(s) => s.clone(),
            StyleValue::Token(token) => self.token_resolver.resolve(token, property),
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
