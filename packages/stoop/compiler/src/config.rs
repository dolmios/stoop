use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use swc_core::plugin::proxies::TransformPluginProgramMetadata;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct StoopConfig {
    pub theme: Theme,
    pub themes: Option<HashMap<String, Theme>>,
    pub media: Option<HashMap<String, String>>,
    pub output: OutputConfig,
    pub prefix: String,
    #[serde(default)]
    pub theme_map: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Theme {
    pub colors: Option<HashMap<String, String>>,
    pub space: Option<HashMap<String, String>>,
    #[serde(alias = "fontSizes")]
    pub font_sizes: Option<HashMap<String, String>>,
    #[serde(alias = "fontWeights")]
    pub font_weights: Option<HashMap<String, String>>,
    #[serde(alias = "lineHeights")]
    pub line_heights: Option<HashMap<String, String>>,
    #[serde(alias = "letterSpacings")]
    pub letter_spacings: Option<HashMap<String, String>>,
    pub sizes: Option<HashMap<String, String>>,
    pub radii: Option<HashMap<String, String>>,
    pub shadows: Option<HashMap<String, String>>,
    #[serde(alias = "zIndices")]
    pub z_indices: Option<HashMap<String, String>>,
    pub transitions: Option<HashMap<String, String>>,
    pub opacities: Option<HashMap<String, String>>,
    pub fonts: Option<HashMap<String, String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
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
            output: OutputConfig::default(),
            prefix: "x".to_string(),
            theme_map,
        }
    }
}

impl Default for OutputConfig {
    fn default() -> Self {
        Self {
            dir: ".stoop".to_string(),
            filename: "styles.css".to_string(),
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
            opacities: None,
            fonts: None,
        }
    }
}

impl StoopConfig {
    /// Creates config from SWC plugin metadata.
    /// The integration plugin (Next.js/Vite) serializes the user's stoop.config.ts
    /// as JSON and passes it via the SWC plugin options.
    pub fn from_metadata(metadata: &TransformPluginProgramMetadata) -> Self {
        if let Some(config_json) = metadata.get_transform_plugin_config() {
            match serde_json::from_str::<StoopConfig>(&config_json) {
                Ok(config) => return config,
                Err(e) => {
                    eprintln!("[stoop] Failed to parse plugin config: {}. Using defaults.", e);
                }
            }
        }
        Self::default()
    }
}
