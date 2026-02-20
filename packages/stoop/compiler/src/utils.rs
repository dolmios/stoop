use std::collections::HashMap;
use crate::types::StyleValue;

/// Common utility prop names that should be converted to CSS properties
/// These are shortcuts like mb, mt, px, py that get converted via utility functions
pub const UTILITY_PROPS: &[&str] = &[
    // Margin utilities
    "m", "mb", "mt", "ml", "mr", "mx", "my",
    // Padding utilities
    "p", "pb", "pt", "pl", "pr", "px", "py",
    // Gap utilities
    "gap", "rowGap", "columnGap",
    // Size utilities (if using theme sizes)
    "w", "h", "minW", "maxW", "minH", "maxH",
];

/// Checks if a prop name is a utility prop that should be converted
pub fn is_utility_prop(prop: &str) -> bool {
    UTILITY_PROPS.contains(&prop)
}

/// Converts utility props to CSS properties
/// This is a simplified version - in production, this would use actual utility functions from config
pub fn convert_utility_to_css_property(utility: &str) -> Option<&str> {
    match utility {
        // Margin utilities
        "m" => Some("margin"),
        "mb" => Some("marginBottom"),
        "mt" => Some("marginTop"),
        "ml" => Some("marginLeft"),
        "mr" => Some("marginRight"),
        "mx" => Some("marginLeft"), // Will need special handling for both left and right
        "my" => Some("marginTop"),  // Will need special handling for both top and bottom
        // Padding utilities
        "p" => Some("padding"),
        "pb" => Some("paddingBottom"),
        "pt" => Some("paddingTop"),
        "pl" => Some("paddingLeft"),
        "pr" => Some("paddingRight"),
        "px" => Some("paddingLeft"), // Will need special handling
        "py" => Some("paddingTop"),  // Will need special handling
        // Gap utilities
        "gap" => Some("gap"),
        "rowGap" => Some("rowGap"),
        "columnGap" => Some("columnGap"),
        // Size utilities
        "w" => Some("width"),
        "h" => Some("height"),
        "minW" => Some("minWidth"),
        "maxW" => Some("maxWidth"),
        "minH" => Some("minHeight"),
        "maxH" => Some("maxHeight"),
        _ => None,
    }
}

/// Handles special utilities that map to multiple CSS properties
/// Returns a map of CSS property -> value
pub fn convert_special_utility(utility: &str, value: StyleValue) -> HashMap<String, StyleValue> {
    let mut result = HashMap::new();

    match utility {
        "mx" => {
            // marginLeft and marginRight
            result.insert("marginLeft".to_string(), value.clone());
            result.insert("marginRight".to_string(), value);
        }
        "my" => {
            // marginTop and marginBottom
            result.insert("marginTop".to_string(), value.clone());
            result.insert("marginBottom".to_string(), value);
        }
        "px" => {
            // paddingLeft and paddingRight
            result.insert("paddingLeft".to_string(), value.clone());
            result.insert("paddingRight".to_string(), value);
        }
        "py" => {
            // paddingTop and paddingBottom
            result.insert("paddingTop".to_string(), value.clone());
            result.insert("paddingBottom".to_string(), value);
        }
        _ => {
            // Single property utility
            if let Some(css_prop) = convert_utility_to_css_property(utility) {
                result.insert(css_prop.to_string(), value);
            }
        }
    }

    result
}

