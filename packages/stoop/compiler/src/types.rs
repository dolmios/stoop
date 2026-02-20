use std::collections::HashMap;
use serde::Serialize;

// --- Existing types (preserved) ---

#[derive(Debug, Clone)]
pub struct StyleExtraction {
    pub component_name: String,
    pub element: String,
    pub base_styles: HashMap<String, StyleValue>,
    pub variants: HashMap<String, HashMap<String, HashMap<String, StyleValue>>>,
    pub nested_selectors: HashMap<String, HashMap<String, StyleValue>>,
    pub compound_variants: Vec<CompoundVariant>,
    pub default_variants: HashMap<String, String>,
}

#[derive(Debug, Clone)]
pub enum StyleValue {
    Static(String),
    Token(String),
    Compound(Vec<StylePart>),
}

#[derive(Debug, Clone)]
pub enum StylePart {
    Static(String),
    Token(String),
}

// --- Atomic CSS types ---

#[derive(Debug, Clone, Serialize)]
pub struct AtomicRule {
    pub class_name: String,
    /// kebab-case CSS property name
    pub property: String,
    /// Resolved CSS value
    pub value: String,
    /// Pseudo-class or pseudo-element, e.g. ":hover", "::before"
    pub pseudo: Option<String>,
    /// At-rule wrapper, e.g. "@media (min-width:768px)"
    pub at_rule: Option<String>,
    /// Priority: 0=base, 1=pseudo, 2=media, 3=pseudo+media
    pub priority: u8,
}

#[derive(Debug, Clone)]
pub struct AtomicCSSOutput {
    pub base_classes: Vec<AtomicRule>,
    pub selector_class: String,
    pub variant_classes: HashMap<String, HashMap<String, Vec<AtomicRule>>>,
    pub compound_variant_classes: Vec<CompoundVariantOutput>,
    pub default_variants: HashMap<String, String>,
}

#[derive(Debug, Clone)]
pub struct CompoundVariant {
    pub conditions: HashMap<String, String>,
    pub styles: HashMap<String, StyleValue>,
}

#[derive(Debug, Clone)]
pub struct CompoundVariantOutput {
    pub conditions: Vec<(String, String)>,
    pub rules: Vec<AtomicRule>,
}

#[derive(Debug, Clone, Serialize)]
pub struct CSSMetadataEntry {
    /// Class name
    #[serde(rename = "c")]
    pub class: String,
    /// CSS rule string
    #[serde(rename = "s")]
    pub css: String,
    /// Insertion priority
    #[serde(rename = "p")]
    pub priority: u8,
    /// Whether this is a global style (not scoped)
    #[serde(rename = "g", skip_serializing_if = "std::ops::Not::not")]
    pub global: bool,
}
