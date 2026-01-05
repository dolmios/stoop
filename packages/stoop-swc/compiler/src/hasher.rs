use std::collections::HashMap;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use crate::types::StyleValue;

pub struct ClassNameHasher;

impl ClassNameHasher {
    pub fn new() -> Self {
        Self
    }

    pub fn hash_styles(
        &self,
        component_name: &str,
        variant_key: &str,
        styles: &HashMap<String, StyleValue>,
    ) -> String {
        let mut hasher = DefaultHasher::new();

        component_name.hash(&mut hasher);
        variant_key.hash(&mut hasher);

        let mut keys: Vec<_> = styles.keys().collect();
        keys.sort();

        for key in keys {
            key.hash(&mut hasher);
            if let Some(value) = styles.get(key) {
                self.hash_style_value(value, &mut hasher);
            }
        }

        let hash = hasher.finish();
        let component_kebab = self.to_kebab_case(component_name);
        let variant_kebab = self.to_kebab_case(variant_key);

        format!("{}-{}-{:x}", component_kebab, variant_kebab, hash & 0xFFFFFF)
    }

    fn hash_style_value(&self, value: &StyleValue, hasher: &mut DefaultHasher) {
        match value {
            StyleValue::Static(s) => s.hash(hasher),
            StyleValue::Token(t) => t.hash(hasher),
            StyleValue::Compound(parts) => {
                for part in parts {
                    match part {
                        crate::types::StylePart::Static(s) => s.hash(hasher),
                        crate::types::StylePart::Token(t) => t.hash(hasher),
                    }
                }
            }
        }
    }

    fn to_kebab_case(&self, input: &str) -> String {
        let mut result = String::new();
        let mut prev_was_upper = false;

        for ch in input.chars() {
            if ch.is_uppercase() {
                if !result.is_empty() && !prev_was_upper {
                    result.push('-');
                }
                result.push(ch.to_lowercase().next().unwrap());
                prev_was_upper = true;
            } else {
                result.push(ch);
                prev_was_upper = false;
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_kebab_case() {
        let hasher = ClassNameHasher::new();
        assert_eq!(hasher.to_kebab_case("Button"), "button");
        assert_eq!(hasher.to_kebab_case("PrimaryButton"), "primary-button");
    }
}
