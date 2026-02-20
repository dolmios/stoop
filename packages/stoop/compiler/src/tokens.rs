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
        // First try the property map for context-aware resolution
        if let Some(scale) = self.property_map.get(property) {
            if self.token_exists_in_scale(token, scale) {
                return format!("var(--{}-{})", scale, token);
            }
        }

        // Fall back to searching all scales
        if let Some(scale) = self.find_token_in_theme(token) {
            return format!("var(--{}-{})", scale, token);
        }

        // Last resort: plain variable
        format!("var(--{})", token)
    }

    fn token_exists_in_scale(&self, token: &str, scale: &str) -> bool {
        let scale_map = match scale {
            "colors" => self.theme.colors.as_ref(),
            "space" => self.theme.space.as_ref(),
            "font-sizes" | "fontSizes" => self.theme.font_sizes.as_ref(),
            "font-weights" | "fontWeights" => self.theme.font_weights.as_ref(),
            "line-heights" | "lineHeights" => self.theme.line_heights.as_ref(),
            "letter-spacings" | "letterSpacings" => self.theme.letter_spacings.as_ref(),
            "sizes" => self.theme.sizes.as_ref(),
            "radii" => self.theme.radii.as_ref(),
            "shadows" => self.theme.shadows.as_ref(),
            "z-indices" | "zIndices" => self.theme.z_indices.as_ref(),
            "transitions" => self.theme.transitions.as_ref(),
            "opacities" => self.theme.opacities.as_ref(),
            "fonts" => self.theme.fonts.as_ref(),
            _ => None,
        };
        scale_map.map(|m| m.contains_key(token)).unwrap_or(false)
    }

    fn find_token_in_theme(&self, token: &str) -> Option<String> {
        let scales: &[(&str, &Option<HashMap<String, String>>)] = &[
            ("colors", &self.theme.colors),
            ("space", &self.theme.space),
            ("font-sizes", &self.theme.font_sizes),
            ("font-weights", &self.theme.font_weights),
            ("line-heights", &self.theme.line_heights),
            ("letter-spacings", &self.theme.letter_spacings),
            ("sizes", &self.theme.sizes),
            ("radii", &self.theme.radii),
            ("shadows", &self.theme.shadows),
            ("z-indices", &self.theme.z_indices),
            ("transitions", &self.theme.transitions),
            ("opacities", &self.theme.opacities),
            ("fonts", &self.theme.fonts),
        ];

        for (scale_name, scale_opt) in scales {
            if let Some(scale) = scale_opt {
                if scale.contains_key(token) {
                    return Some(scale_name.to_string());
                }
            }
        }

        None
    }

    fn build_property_map() -> HashMap<String, String> {
        let mut map = HashMap::new();

        // Color properties
        for prop in &[
            "color", "backgroundColor", "borderColor",
            "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor",
            "outlineColor", "caretColor", "accentColor", "fill", "stroke",
        ] {
            map.insert(prop.to_string(), "colors".to_string());
        }

        // Spacing properties
        for prop in &[
            "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
            "paddingInline", "paddingBlock", "paddingInlineStart", "paddingInlineEnd",
            "margin", "marginTop", "marginRight", "marginBottom", "marginLeft",
            "marginInline", "marginBlock", "marginInlineStart", "marginInlineEnd",
            "gap", "rowGap", "columnGap",
            "top", "right", "bottom", "left", "inset",
        ] {
            map.insert(prop.to_string(), "space".to_string());
        }

        // Size properties
        for prop in &[
            "width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight",
            "flexBasis",
        ] {
            map.insert(prop.to_string(), "sizes".to_string());
        }

        // Font properties
        map.insert("fontSize".to_string(), "font-sizes".to_string());
        map.insert("fontWeight".to_string(), "font-weights".to_string());
        map.insert("lineHeight".to_string(), "line-heights".to_string());
        map.insert("letterSpacing".to_string(), "letter-spacings".to_string());
        map.insert("fontFamily".to_string(), "fonts".to_string());

        // Border radius
        for prop in &[
            "borderRadius", "borderTopLeftRadius", "borderTopRightRadius",
            "borderBottomLeftRadius", "borderBottomRightRadius",
        ] {
            map.insert(prop.to_string(), "radii".to_string());
        }

        // Shadows
        map.insert("boxShadow".to_string(), "shadows".to_string());
        map.insert("textShadow".to_string(), "shadows".to_string());

        // Transitions
        map.insert("transition".to_string(), "transitions".to_string());

        // Z-index
        map.insert("zIndex".to_string(), "z-indices".to_string());

        // Opacity
        map.insert("opacity".to_string(), "opacities".to_string());

        map
    }
}
