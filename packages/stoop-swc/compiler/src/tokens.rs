use std::collections::HashMap;
use crate::config::Theme;

pub struct TokenResolver {
    theme: Theme,
    property_map: HashMap<String, String>,
}

impl TokenResolver {
    pub fn new(theme: &Theme) -> Self {
        Self {
            theme: theme.clone(),
            property_map: Self::build_property_map(),
        }
    }

    pub fn resolve(&self, token: &str, property: &str) -> String {
        if !token.starts_with('$') {
            return token.to_string();
        }

        let token_name = &token[1..];

        if token_name.contains('.') {
            return self.resolve_explicit(token_name);
        }

        self.resolve_shorthand(token_name, property)
    }

    fn resolve_explicit(&self, token: &str) -> String {
        let parts: Vec<&str> = token.split('.').collect();
        if parts.len() == 2 {
            format!("var(--{}-{})", parts[0], parts[1])
        } else {
            format!("var(--{})", token.replace('.', "-"))
        }
    }

    fn resolve_shorthand(&self, token: &str, property: &str) -> String {
        if let Some(scale) = self.property_map.get(property) {
            if self.token_exists_in_scale(token, scale) {
                return format!("var(--{}-{})", scale, token);
            }
        }

        if let Some(scale) = self.find_token_in_theme(token) {
            return format!("var(--{}-{})", scale, token);
        }

        format!("var(--{})", token)
    }

    fn token_exists_in_scale(&self, token: &str, scale: &str) -> bool {
        match scale {
            "colors" => self.theme.colors.as_ref()
                .map(|m| m.contains_key(token))
                .unwrap_or(false),
            "space" => self.theme.space.as_ref()
                .map(|m| m.contains_key(token))
                .unwrap_or(false),
            "fontSizes" | "font-sizes" => self.theme.font_sizes.as_ref()
                .map(|m| m.contains_key(token))
                .unwrap_or(false),
            _ => false,
        }
    }

    fn find_token_in_theme(&self, token: &str) -> Option<String> {
        if let Some(colors) = &self.theme.colors {
            if colors.contains_key(token) {
                return Some("colors".to_string());
            }
        }

        if let Some(space) = &self.theme.space {
            if space.contains_key(token) {
                return Some("space".to_string());
            }
        }

        if let Some(font_sizes) = &self.theme.font_sizes {
            if font_sizes.contains_key(token) {
                return Some("font-sizes".to_string());
            }
        }

        None
    }

    fn build_property_map() -> HashMap<String, String> {
        let mut map = HashMap::new();

        // Color properties
        map.insert("color".to_string(), "colors".to_string());
        map.insert("backgroundColor".to_string(), "colors".to_string());
        map.insert("borderColor".to_string(), "colors".to_string());
        map.insert("borderTopColor".to_string(), "colors".to_string());
        map.insert("borderRightColor".to_string(), "colors".to_string());
        map.insert("borderBottomColor".to_string(), "colors".to_string());
        map.insert("borderLeftColor".to_string(), "colors".to_string());
        map.insert("outlineColor".to_string(), "colors".to_string());

        // Spacing properties
        map.insert("padding".to_string(), "space".to_string());
        map.insert("paddingTop".to_string(), "space".to_string());
        map.insert("paddingRight".to_string(), "space".to_string());
        map.insert("paddingBottom".to_string(), "space".to_string());
        map.insert("paddingLeft".to_string(), "space".to_string());
        map.insert("margin".to_string(), "space".to_string());
        map.insert("marginTop".to_string(), "space".to_string());
        map.insert("marginRight".to_string(), "space".to_string());
        map.insert("marginBottom".to_string(), "space".to_string());
        map.insert("marginLeft".to_string(), "space".to_string());
        map.insert("gap".to_string(), "space".to_string());
        map.insert("rowGap".to_string(), "space".to_string());
        map.insert("columnGap".to_string(), "space".to_string());

        // Font properties
        map.insert("fontSize".to_string(), "font-sizes".to_string());
        map.insert("fontWeight".to_string(), "font-weights".to_string());
        map.insert("lineHeight".to_string(), "line-heights".to_string());
        map.insert("letterSpacing".to_string(), "letter-spacings".to_string());

        // Border radius
        map.insert("borderRadius".to_string(), "radii".to_string());
        map.insert("borderTopLeftRadius".to_string(), "radii".to_string());
        map.insert("borderTopRightRadius".to_string(), "radii".to_string());
        map.insert("borderBottomLeftRadius".to_string(), "radii".to_string());
        map.insert("borderBottomRightRadius".to_string(), "radii".to_string());

        // Shadows
        map.insert("boxShadow".to_string(), "shadows".to_string());
        map.insert("textShadow".to_string(), "shadows".to_string());

        // Transitions
        map.insert("transition".to_string(), "transitions".to_string());

        map
    }
}
