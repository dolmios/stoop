use std::fmt;

/// Errors that can occur during CSS compilation
/// Note: Currently unused but kept for future error handling improvements
#[allow(dead_code)]
#[derive(Debug)]
pub enum StoopError {
    /// Failed to write CSS file
    WriteError(String),
    /// Failed to read config file
    ConfigError(String),
    /// Invalid style value
    InvalidStyle(String),
}

impl fmt::Display for StoopError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            StoopError::WriteError(msg) => write!(f, "Failed to write CSS: {}", msg),
            StoopError::ConfigError(msg) => write!(f, "Config error: {}", msg),
            StoopError::InvalidStyle(msg) => write!(f, "Invalid style: {}", msg),
        }
    }
}

impl std::error::Error for StoopError {}
