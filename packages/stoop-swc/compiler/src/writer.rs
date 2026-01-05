use std::fs;
use std::path::PathBuf;
use std::io::Write;

use crate::config::StoopConfig;
use crate::types::CSSOutput;

pub struct StyleWriter {
    config: StoopConfig,
    accumulated_css: String,
}

impl StyleWriter {
    pub fn new(config: &StoopConfig) -> Self {
        Self {
            config: config.clone(),
            accumulated_css: String::new(),
        }
    }

    pub fn register_styles(&mut self, output: &CSSOutput) {
        self.accumulated_css.push_str(&output.css);
        self.accumulated_css.push('\n');
    }

    pub fn write_all(&self) {
        if self.accumulated_css.is_empty() {
            return;
        }

        let output_path = self.get_output_path();

        // Create parent directory if it doesn't exist
        if let Some(parent) = output_path.parent() {
            if let Err(e) = fs::create_dir_all(parent) {
                eprintln!("Warning: Failed to create directory {:?}: {}", parent, e);
                return;
            }
        }

        // Try to create or append to the file
        match fs::File::create(&output_path) {
            Ok(mut file) => {
                let theme_css = self.generate_theme_css();
                if let Err(e) = file.write_all(theme_css.as_bytes()) {
                    eprintln!("Warning: Failed to write theme CSS: {}", e);
                }
                if let Err(e) = file.write_all(b"\n\n") {
                    eprintln!("Warning: Failed to write separator: {}", e);
                }
                if let Err(e) = file.write_all(self.accumulated_css.as_bytes()) {
                    eprintln!("Warning: Failed to write CSS: {}", e);
                }
            }
            Err(e) => {
                eprintln!("Warning: Failed to create CSS file {:?}: {}", output_path, e);
            }
        }
    }

    fn get_output_path(&self) -> PathBuf {
        // Resolve path relative to current working directory
        // In production, this should be resolved relative to project root
        let dir = PathBuf::from(&self.config.output.dir);
        dir.join(&self.config.output.filename)
    }

    fn generate_theme_css(&self) -> String {
        let mut css = String::from(":root {\n");

        // Generate CSS variables for all theme scales
        if let Some(colors) = &self.config.theme.colors {
            for (key, value) in colors {
                css.push_str(&format!("  --colors-{}: {};\n", key, value));
            }
        }

        if let Some(space) = &self.config.theme.space {
            for (key, value) in space {
                css.push_str(&format!("  --space-{}: {};\n", key, value));
            }
        }

        if let Some(font_sizes) = &self.config.theme.font_sizes {
            for (key, value) in font_sizes {
                css.push_str(&format!("  --font-sizes-{}: {};\n", key, value));
            }
        }

        if let Some(font_weights) = &self.config.theme.font_weights {
            for (key, value) in font_weights {
                css.push_str(&format!("  --font-weights-{}: {};\n", key, value));
            }
        }

        if let Some(line_heights) = &self.config.theme.line_heights {
            for (key, value) in line_heights {
                css.push_str(&format!("  --line-heights-{}: {};\n", key, value));
            }
        }

        if let Some(letter_spacings) = &self.config.theme.letter_spacings {
            for (key, value) in letter_spacings {
                css.push_str(&format!("  --letter-spacings-{}: {};\n", key, value));
            }
        }

        if let Some(radii) = &self.config.theme.radii {
            for (key, value) in radii {
                css.push_str(&format!("  --radii-{}: {};\n", key, value));
            }
        }

        if let Some(shadows) = &self.config.theme.shadows {
            for (key, value) in shadows {
                css.push_str(&format!("  --shadows-{}: {};\n", key, value));
            }
        }

        if let Some(transitions) = &self.config.theme.transitions {
            for (key, value) in transitions {
                css.push_str(&format!("  --transitions-{}: {};\n", key, value));
            }
        }

        css.push_str("}\n");

        if let Some(themes) = &self.config.themes {
            for (theme_name, theme) in themes {
                css.push_str(&format!("\n[data-theme=\"{}\"] {{\n", theme_name));

                // Generate overrides for all theme scales in alternate themes
                if let Some(colors) = &theme.colors {
                    for (key, value) in colors {
                        css.push_str(&format!("  --colors-{}: {};\n", key, value));
                    }
                }
                if let Some(space) = &theme.space {
                    for (key, value) in space {
                        css.push_str(&format!("  --space-{}: {};\n", key, value));
                    }
                }
                if let Some(font_sizes) = &theme.font_sizes {
                    for (key, value) in font_sizes {
                        css.push_str(&format!("  --font-sizes-{}: {};\n", key, value));
                    }
                }
                // Add other scales as needed...

                css.push_str("}\n");
            }
        }

        css
    }
}
