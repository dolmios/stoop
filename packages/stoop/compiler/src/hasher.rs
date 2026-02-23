const FNV_OFFSET_BASIS: u32 = 2166136261;
const FNV_PRIME: u32 = 16777619;

/// FNV-1a hash using UTF-16 code units for JS parity.
fn fnv1a_hash(input: &str) -> u32 {
    let mut hash = FNV_OFFSET_BASIS;
    for code_unit in input.encode_utf16() {
        hash ^= code_unit as u32;
        hash = hash.wrapping_mul(FNV_PRIME);
    }
    hash
}

/// Encode a u32 as a base36 string.
fn to_base36(mut value: u32) -> String {
    if value == 0 {
        return "0".to_string();
    }

    const CHARS: &[u8; 36] = b"0123456789abcdefghijklmnopqrstuvwxyz";
    let mut result = Vec::new();

    while value > 0 {
        let remainder = (value % 36) as usize;
        result.push(CHARS[remainder]);
        value /= 36;
    }

    result.reverse();
    String::from_utf8(result).unwrap()
}

/// Hash a single atomic CSS property-value pair with optional context (pseudo/media).
///
/// Returns a class name like "x1a2b3c" (where "x" is the configured prefix).
/// - `context` is empty for base styles, ":hover" for pseudo, "@media (...)" for media queries.
/// - `prefix` is prepended to the base36 hash (e.g., "x" by default from config).
pub fn hash_atomic(property: &str, value: &str, context: &str, prefix: &str) -> String {
    let input = if context.is_empty() {
        format!("{}:{}", property, value)
    } else {
        format!("{}:{}:{}", context, property, value)
    };

    let hash = fnv1a_hash(&input);
    format!("{}{}", prefix, to_base36(hash))
}

/// Hash an arbitrary string (for keyframe names, selector IDs, etc.).
///
/// Returns a string like "x1a2b3c" (where "x" is the configured prefix).
/// - `prefix` is prepended to the base36 hash (e.g., "x" by default from config).
pub fn hash_string(input: &str, prefix: &str) -> String {
    let hash = fnv1a_hash(input);
    format!("{}{}", prefix, to_base36(hash))
}

/// Convert a camelCase or PascalCase string to kebab-case.
///
/// Handles consecutive uppercase correctly:
/// - `HTMLElement` -> `html-element` (not `htmlelement`)
/// - `backgroundColor` -> `background-color`
/// - `XMLHTTPRequest` -> `xmlhttp-request`
pub fn to_kebab_case(input: &str) -> String {
    let mut result = String::new();
    let chars: Vec<char> = input.chars().collect();

    for i in 0..chars.len() {
        let ch = chars[i];
        if ch.is_uppercase() {
            let prev_was_upper = i > 0 && chars[i - 1].is_uppercase();
            let next_is_lower = i + 1 < chars.len() && chars[i + 1].is_lowercase();

            if !result.is_empty() {
                if !prev_was_upper {
                    // Start of a new uppercase run or single uppercase char
                    result.push('-');
                } else if next_is_lower {
                    // End of an uppercase run followed by lowercase (e.g., the 'E' in "HTMLElement")
                    result.push('-');
                }
            }
            result.push(ch.to_lowercase().next().unwrap());
        } else {
            result.push(ch);
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_kebab_case() {
        assert_eq!(to_kebab_case("Button"), "button");
        assert_eq!(to_kebab_case("PrimaryButton"), "primary-button");
        assert_eq!(to_kebab_case("backgroundColor"), "background-color");
        assert_eq!(to_kebab_case("fontSize"), "font-size");
    }

    #[test]
    fn test_kebab_case_consecutive_uppercase() {
        assert_eq!(to_kebab_case("HTMLElement"), "html-element");
        assert_eq!(to_kebab_case("XMLHTTPRequest"), "xmlhttp-request");
        assert_eq!(to_kebab_case("getURL"), "get-url");
        assert_eq!(to_kebab_case("cssID"), "css-id");
        assert_eq!(to_kebab_case("ABC"), "abc");
    }

    #[test]
    fn test_hash_atomic_deterministic() {
        let a = hash_atomic("color", "red", "", "x");
        let b = hash_atomic("color", "red", "", "x");
        assert_eq!(a, b, "Same input must produce the same hash");
    }

    #[test]
    fn test_hash_atomic_unique_for_different_values() {
        let a = hash_atomic("color", "red", "", "x");
        let b = hash_atomic("color", "blue", "", "x");
        assert_ne!(a, b, "Different values must produce different hashes");
    }

    #[test]
    fn test_hash_atomic_unique_for_different_properties() {
        let a = hash_atomic("color", "red", "", "x");
        let b = hash_atomic("background-color", "red", "", "x");
        assert_ne!(a, b, "Different properties must produce different hashes");
    }

    #[test]
    fn test_hash_atomic_with_context() {
        let base = hash_atomic("color", "red", "", "x");
        let hover = hash_atomic("color", "red", ":hover", "x");
        let media = hash_atomic("color", "red", "@media (min-width:768px)", "x");
        assert_ne!(base, hover, "Base and pseudo must differ");
        assert_ne!(base, media, "Base and media must differ");
        assert_ne!(hover, media, "Pseudo and media must differ");
    }

    #[test]
    fn test_hash_atomic_starts_with_x() {
        let h = hash_atomic("color", "red", "", "x");
        assert!(h.starts_with('x'), "Hash must start with 'x'");
    }

    #[test]
    fn test_hash_atomic_custom_prefix() {
        let h = hash_atomic("color", "red", "", "st");
        assert!(h.starts_with("st"), "Hash must start with custom prefix 'st'");
    }

    #[test]
    fn test_hash_string_deterministic() {
        let a = hash_string("fadeIn", "x");
        let b = hash_string("fadeIn", "x");
        assert_eq!(a, b, "Same input must produce the same hash");
    }

    #[test]
    fn test_hash_string_unique() {
        let a = hash_string("fadeIn", "x");
        let b = hash_string("fadeOut", "x");
        assert_ne!(a, b, "Different inputs must produce different hashes");
    }

    #[test]
    fn test_hash_string_starts_with_x() {
        let h = hash_string("fadeIn", "x");
        assert!(h.starts_with('x'), "Hash must start with 'x'");
    }

    #[test]
    fn test_hash_string_custom_prefix() {
        let h = hash_string("fadeIn", "myapp");
        assert!(h.starts_with("myapp"), "Hash must start with custom prefix 'myapp'");
    }

    #[test]
    fn test_base36_encoding() {
        assert_eq!(to_base36(0), "0");
        assert_eq!(to_base36(35), "z");
        assert_eq!(to_base36(36), "10");
        assert_eq!(to_base36(100), "2s");
    }
}
