use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use swc_core::plugin::proxies::TransformPluginProgramMetadata;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StoopConfig {
    pub theme: Theme,
    pub themes: Option<HashMap<String, Theme>>,
    pub media: Option<HashMap<String, String>>,
    pub output: OutputConfig,
    pub prefix: String,
    pub theme_map: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Theme {
    pub colors: Option<HashMap<String, String>>,
    pub space: Option<HashMap<String, String>>,
    pub font_sizes: Option<HashMap<String, String>>,
    pub font_weights: Option<HashMap<String, String>>,
    pub line_heights: Option<HashMap<String, String>>,
    pub letter_spacings: Option<HashMap<String, String>>,
    pub sizes: Option<HashMap<String, String>>,
    pub radii: Option<HashMap<String, String>>,
    pub shadows: Option<HashMap<String, String>>,
    pub z_indices: Option<HashMap<String, String>>,
    pub transitions: Option<HashMap<String, String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutputConfig {
    pub dir: String,
    pub filename: String,
}

impl Default for StoopConfig {
    fn default() -> Self {
        let mut theme_map = HashMap::new();
        theme_map.insert("gap".to_string(), "space".to_string());
        theme_map.insert("rowGap".to_string(), "space".to_string());
        theme_map.insert("columnGap".to_string(), "space".to_string());

        Self {
            theme: Theme::default(),
            themes: None,
            media: None,
            output: OutputConfig {
                dir: ".stoop".to_string(),
                filename: "styles.css".to_string(),
            },
            prefix: "stoop".to_string(),
            theme_map,
        }
    }
}

impl Default for Theme {
    fn default() -> Self {
        Self {
            colors: None,
            space: None,
            font_sizes: None,
            font_weights: None,
            line_heights: None,
            letter_spacings: None,
            sizes: None,
            radii: None,
            shadows: None,
            z_indices: None,
            transitions: None,
        }
    }
}

impl StoopConfig {
    /// Creates config from plugin metadata
    ///
    /// Note: Config file loading from styled.config.ts is not yet implemented.
    /// Configuration must be passed via plugin metadata in next.config.mjs or similar.
    /// For now, returns default config with minimal theme values.
    pub fn from_metadata(_metadata: &TransformPluginProgramMetadata) -> Self {
        let mut config = Self::default();

        // Provide minimal default theme so plugin works out of the box
        let mut colors = HashMap::new();
        colors.insert("primary".to_string(), "#0070f3".to_string());
        colors.insert("secondary".to_string(), "#666".to_string());
        colors.insert("background".to_string(), "#fff".to_string());
        colors.insert("text".to_string(), "#000".to_string());

        let mut space = HashMap::new();
        space.insert("sm".to_string(), "8px".to_string());
        space.insert("md".to_string(), "16px".to_string());
        space.insert("lg".to_string(), "24px".to_string());

        let mut font_sizes = HashMap::new();
        font_sizes.insert("sm".to_string(), "14px".to_string());
        font_sizes.insert("md".to_string(), "16px".to_string());
        font_sizes.insert("lg".to_string(), "18px".to_string());

        config.theme.colors = Some(colors);
        config.theme.space = Some(space);
        config.theme.font_sizes = Some(font_sizes);

        config
    }

    /// Attempts to load config from styled.config.ts file
    ///
    /// Note: Not yet implemented. Config file loading would require:
    /// 1. Reading styled.config.ts from project root
    /// 2. Parsing TypeScript/JavaScript config file
    /// 3. Extracting default export
    /// 4. Deserializing into StoopConfig
    ///
    /// Currently, configuration must be passed via plugin metadata.
    /// Returns None until this feature is implemented.
    #[allow(dead_code)]
    pub fn try_load_from_file(_project_root: &std::path::Path) -> Option<Self> {
        None
    }
}
