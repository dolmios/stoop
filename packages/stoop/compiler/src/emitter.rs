use crate::types::{AtomicRule, CSSMetadataEntry};

pub struct CSSEmitter {
    entries: Vec<CSSMetadataEntry>,
}

impl CSSEmitter {
    pub fn new() -> Self {
        Self {
            entries: Vec::new(),
        }
    }

    /// Register atomic rules from a styled/css/keyframes call.
    pub fn register_rules(&mut self, rules: &[AtomicRule]) {
        for rule in rules {
            let css = self.format_rule(rule);
            self.entries.push(CSSMetadataEntry {
                class: rule.class_name.clone(),
                css,
                priority: rule.priority,
                global: false,
            });
        }
    }

    /// Register a global CSS rule (from globalCss).
    pub fn register_global(&mut self, selector: &str, css: &str) {
        self.entries.push(CSSMetadataEntry {
            class: String::new(),
            css: format!("{}{{{}}}", selector, css),
            priority: 0,
            global: true,
        });
    }

    /// Register a @keyframes block.
    pub fn register_keyframes(&mut self, name: &str, css: &str) {
        self.entries.push(CSSMetadataEntry {
            class: String::new(),
            css: format!("@keyframes {}{{{}}}", name, css),
            priority: 0,
            global: true,
        });
    }

    /// Format a single atomic rule to a minified CSS string.
    ///
    /// Produces:
    /// - Base:         `.x1a2b{color:red}`
    /// - Pseudo:       `.x1a2b:hover{color:blue}`
    /// - Media:        `@media (min-width:768px){.x1a2b{padding:2rem}}`
    /// - Media+pseudo: `@media (min-width:768px){.x1a2b:hover{color:blue}}`
    fn format_rule(&self, rule: &AtomicRule) -> String {
        let pseudo = rule.pseudo.as_deref().unwrap_or("");
        let declaration = format!(
            ".{}{}{{{}:{}}}",
            rule.class_name, pseudo, rule.property, rule.value
        );

        match &rule.at_rule {
            Some(at_rule) => format!("{}{{{}}}", at_rule, declaration),
            None => declaration,
        }
    }

    /// Serialize all registered entries to a JSON string.
    pub fn to_json(&self) -> String {
        serde_json::to_string(&self.entries).unwrap_or_else(|_| "[]".to_string())
    }

    /// Returns true if no entries have been registered.
    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::AtomicRule;

    #[test]
    fn test_format_base_rule() {
        let emitter = CSSEmitter::new();
        let rule = AtomicRule {
            class_name: "x1a2b".to_string(),
            property: "color".to_string(),
            value: "red".to_string(),
            pseudo: None,
            at_rule: None,
            priority: 0,
        };
        assert_eq!(emitter.format_rule(&rule), ".x1a2b{color:red}");
    }

    #[test]
    fn test_format_pseudo_rule() {
        let emitter = CSSEmitter::new();
        let rule = AtomicRule {
            class_name: "x1a2b".to_string(),
            property: "color".to_string(),
            value: "blue".to_string(),
            pseudo: Some(":hover".to_string()),
            at_rule: None,
            priority: 1,
        };
        assert_eq!(emitter.format_rule(&rule), ".x1a2b:hover{color:blue}");
    }

    #[test]
    fn test_format_media_rule() {
        let emitter = CSSEmitter::new();
        let rule = AtomicRule {
            class_name: "x1a2b".to_string(),
            property: "padding".to_string(),
            value: "2rem".to_string(),
            pseudo: None,
            at_rule: Some("@media (min-width:768px)".to_string()),
            priority: 2,
        };
        assert_eq!(
            emitter.format_rule(&rule),
            "@media (min-width:768px){.x1a2b{padding:2rem}}"
        );
    }

    #[test]
    fn test_format_media_pseudo_rule() {
        let emitter = CSSEmitter::new();
        let rule = AtomicRule {
            class_name: "x1a2b".to_string(),
            property: "color".to_string(),
            value: "blue".to_string(),
            pseudo: Some(":hover".to_string()),
            at_rule: Some("@media (min-width:768px)".to_string()),
            priority: 3,
        };
        assert_eq!(
            emitter.format_rule(&rule),
            "@media (min-width:768px){.x1a2b:hover{color:blue}}"
        );
    }

    #[test]
    fn test_register_and_json() {
        let mut emitter = CSSEmitter::new();
        assert!(emitter.is_empty());

        emitter.register_rules(&[AtomicRule {
            class_name: "x1a2b".to_string(),
            property: "color".to_string(),
            value: "red".to_string(),
            pseudo: None,
            at_rule: None,
            priority: 0,
        }]);

        assert!(!emitter.is_empty());
        let json = emitter.to_json();
        assert!(json.contains("\"c\":\"x1a2b\""));
        assert!(json.contains("\"s\":\".x1a2b{color:red}\""));
        assert!(json.contains("\"p\":0"));
        // global is false, so "g" should be skipped
        assert!(!json.contains("\"g\""));
    }

    #[test]
    fn test_register_global() {
        let mut emitter = CSSEmitter::new();
        emitter.register_global("body", "margin:0;padding:0");
        let json = emitter.to_json();
        assert!(json.contains("body{margin:0;padding:0}"));
        assert!(json.contains("\"g\":true"));
    }

    #[test]
    fn test_register_keyframes() {
        let mut emitter = CSSEmitter::new();
        emitter.register_keyframes("fadeIn", "from{opacity:0}to{opacity:1}");
        let json = emitter.to_json();
        assert!(json.contains("@keyframes fadeIn{from{opacity:0}to{opacity:1}}"));
        assert!(json.contains("\"g\":true"));
    }
}
