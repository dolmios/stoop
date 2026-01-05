use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct StyleExtraction {
    pub component_name: String,
    pub element: String,
    pub base_styles: HashMap<String, StyleValue>,
    pub variants: HashMap<String, HashMap<String, HashMap<String, StyleValue>>>,
    pub nested_selectors: HashMap<String, HashMap<String, StyleValue>>,
    pub composed_component_class: Option<String>, // Class name from composed component
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

pub struct CSSOutput {
    pub base_class: String,
    pub selector_class: String, // Selector class name for component targeting
    pub variant_classes: HashMap<String, HashMap<String, String>>,
    pub css: String,
}
