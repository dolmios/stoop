mod test_utils;

// =============================================================================
// 1. styled() basic transforms
// =============================================================================

#[test]
fn test_styled_basic() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "red",
            fontSize: "16px",
        });
    "#;
    let output = test_utils::transform(input);

    // Should contain forwardRef wrapping the component
    assert!(output.contains("forwardRef"), "Expected forwardRef in output:\n{}", output);

    // Should contain createElement for rendering
    assert!(output.contains("createElement"), "Expected createElement in output:\n{}", output);

    // Should contain clsx for class name merging
    assert!(output.contains("clsx"), "Expected clsx in output:\n{}", output);

    // Should contain __stoop_css__ metadata
    assert!(output.contains("__stoop_css__"), "Expected __stoop_css__ metadata in output:\n{}", output);

    // Should NOT contain the original styled() call
    assert!(!output.contains("styled("), "styled() call should be removed from output:\n{}", output);

    // Should destructure props (className, rest, as)
    assert!(output.contains("className"), "Expected className destructuring in output:\n{}", output);
    assert!(output.contains("rest"), "Expected rest spread in output:\n{}", output);

    // The element should be "button"
    assert!(output.contains("\"button\""), "Expected 'button' element in output:\n{}", output);
}

#[test]
fn test_styled_div_element() {
    let input = r#"
        import { styled } from "stoop";
        const Box = styled("div", {
            display: "flex",
        });
    "#;
    let output = test_utils::transform(input);

    assert!(output.contains("\"div\""), "Expected 'div' element in output:\n{}", output);
    assert!(output.contains("forwardRef"), "Expected forwardRef:\n{}", output);
}

#[test]
fn test_styled_generates_atomic_class_names() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "red",
        });
    "#;
    let output = test_utils::transform(input);

    // Atomic class names start with "x" in the __stoop_css__ metadata
    assert!(output.contains("\"x"), "Expected atomic class names starting with 'x' in output:\n{}", output);
}

#[test]
fn test_styled_multiple_properties() {
    let input = r#"
        import { styled } from "stoop";
        const Card = styled("div", {
            color: "blue",
            padding: "8px",
            margin: "4px",
            display: "flex",
        });
    "#;
    let output = test_utils::transform(input);

    assert!(output.contains("forwardRef"), "Expected forwardRef:\n{}", output);
    assert!(output.contains("__stoop_css__"), "Expected CSS metadata:\n{}", output);

    // The metadata should contain CSS rules for all properties
    assert!(output.contains("color:blue"), "Expected color:blue in CSS metadata:\n{}", output);
    assert!(output.contains("padding:8px"), "Expected padding:8px in CSS metadata:\n{}", output);
    assert!(output.contains("margin:4px"), "Expected margin:4px in CSS metadata:\n{}", output);
    assert!(output.contains("display:flex"), "Expected display:flex in CSS metadata:\n{}", output);
}

#[test]
fn test_styled_with_component_composition() {
    let input = r#"
        import { styled } from "stoop";
        const PrimaryButton = styled(Button, {
            color: "blue",
        });
    "#;
    let output = test_utils::transform(input);

    // Should reference the Button identifier, not a string
    assert!(output.contains("Button"), "Expected Button component reference in output:\n{}", output);
    assert!(output.contains("forwardRef"), "Expected forwardRef:\n{}", output);
}

// =============================================================================
// 2. styled() with variants
// =============================================================================

#[test]
fn test_styled_with_variants() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "black",
            variants: {
                size: {
                    small: { fontSize: "12px" },
                    large: { fontSize: "24px" },
                },
            },
        });
    "#;
    let output = test_utils::transform(input);

    // Variant prop should be destructured from props
    assert!(output.contains("size"), "Expected 'size' variant prop destructured:\n{}", output);

    // Should generate conditionals: size === "small" && "classes"
    assert!(output.contains("==="), "Expected === conditional for variant:\n{}", output);
    assert!(output.contains("\"small\""), "Expected 'small' variant value:\n{}", output);
    assert!(output.contains("\"large\""), "Expected 'large' variant value:\n{}", output);

    // Should use && for conditional class application
    assert!(output.contains("&&"), "Expected && logical AND for variant conditional:\n{}", output);
}

#[test]
fn test_styled_with_multiple_variants() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            variants: {
                size: {
                    small: { fontSize: "12px" },
                    large: { fontSize: "24px" },
                },
                color: {
                    red: { color: "red" },
                    blue: { color: "blue" },
                },
            },
        });
    "#;
    let output = test_utils::transform(input);

    // Both variant props should be destructured
    assert!(output.contains("size"), "Expected 'size' variant prop:\n{}", output);
    // "color" appears as a CSS property too, so just check it's present
    assert!(output.contains("color"), "Expected 'color' variant prop:\n{}", output);

    // Should have conditionals for all variant values
    assert!(output.contains("\"small\""), "Expected 'small' value:\n{}", output);
    assert!(output.contains("\"large\""), "Expected 'large' value:\n{}", output);
    assert!(output.contains("\"red\""), "Expected 'red' value:\n{}", output);
    assert!(output.contains("\"blue\""), "Expected 'blue' value:\n{}", output);
}

#[test]
fn test_styled_with_boolean_variant() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            variants: {
                disabled: {
                    true: { opacity: "0.5" },
                    false: { opacity: "1" },
                },
            },
        });
    "#;
    let output = test_utils::transform(input);

    // Boolean variants should compare with true/false literals, not strings
    assert!(output.contains("disabled"), "Expected 'disabled' variant:\n{}", output);
    assert!(output.contains("==="), "Expected === comparison:\n{}", output);
}

// =============================================================================
// 3. styled() with defaultVariants
// =============================================================================

#[test]
fn test_styled_with_default_variants() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            variants: {
                size: {
                    small: { fontSize: "12px" },
                    large: { fontSize: "24px" },
                },
            },
            defaultVariants: {
                size: "small",
            },
        });
    "#;
    let output = test_utils::transform(input);

    // Should generate an undefined check: size === undefined && "classes"
    assert!(output.contains("undefined"), "Expected undefined check for default variant:\n{}", output);
    assert!(output.contains("==="), "Expected === comparison:\n{}", output);

    // The variant prop should still be destructured
    assert!(output.contains("size"), "Expected 'size' destructured:\n{}", output);
}

#[test]
fn test_styled_with_multiple_default_variants() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            variants: {
                size: {
                    small: { fontSize: "12px" },
                    large: { fontSize: "24px" },
                },
                variant: {
                    primary: { color: "blue" },
                    secondary: { color: "gray" },
                },
            },
            defaultVariants: {
                size: "small",
                variant: "primary",
            },
        });
    "#;
    let output = test_utils::transform(input);

    // Should have undefined checks for both defaults
    // Count occurrences of "undefined"
    let undefined_count = output.matches("undefined").count();
    assert!(undefined_count >= 2, "Expected at least 2 undefined checks for 2 defaults, got {}:\n{}", undefined_count, output);
}

// =============================================================================
// 4. styled() with compoundVariants
// =============================================================================

#[test]
fn test_styled_with_compound_variants() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            variants: {
                size: {
                    small: { fontSize: "12px" },
                    large: { fontSize: "24px" },
                },
                color: {
                    red: { color: "red" },
                    blue: { color: "blue" },
                },
            },
            compoundVariants: [
                {
                    size: "large",
                    color: "red",
                    css: {
                        fontWeight: "bold",
                    },
                },
            ],
        });
    "#;
    let output = test_utils::transform(input);

    // Compound variants generate chained && conditionals
    // e.g., color === "red" && size === "large" && "classes"
    let and_count = output.matches("&&").count();
    // At minimum: variant conditionals + compound variant conditions
    // The compound variant has 2 conditions chained with &&, plus the class string
    assert!(and_count >= 3, "Expected at least 3 && operators for compound variant chain, got {}:\n{}", and_count, output);

    // The compound variant CSS should appear in metadata
    assert!(output.contains("font-weight:bold"), "Expected font-weight:bold in CSS metadata:\n{}", output);
}

#[test]
fn test_styled_with_multiple_compound_variants() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            variants: {
                size: {
                    small: { fontSize: "12px" },
                    large: { fontSize: "24px" },
                },
                intent: {
                    primary: { color: "blue" },
                    danger: { color: "red" },
                },
            },
            compoundVariants: [
                {
                    size: "large",
                    intent: "primary",
                    css: { fontWeight: "bold" },
                },
                {
                    size: "small",
                    intent: "danger",
                    css: { textDecoration: "underline" },
                },
            ],
        });
    "#;
    let output = test_utils::transform(input);

    // Both compound variant styles should appear in metadata
    assert!(output.contains("font-weight:bold"), "Expected font-weight:bold:\n{}", output);
    assert!(output.contains("text-decoration:underline"), "Expected text-decoration:underline:\n{}", output);
}

// =============================================================================
// 5. css() transforms
// =============================================================================

#[test]
fn test_css_basic() {
    let input = r#"
        import { css } from "stoop";
        const cls = css({ color: "blue", padding: "8px" });
    "#;
    let output = test_utils::transform(input);

    // Should replace css() with a string literal containing class names
    assert!(!output.contains("css("), "css() call should be replaced:\n{}", output);

    // The output should have the variable assigned to a string with atomic class names
    assert!(output.contains("\"x"), "Expected atomic class name starting with 'x':\n{}", output);

    // CSS metadata should be present
    assert!(output.contains("__stoop_css__"), "Expected __stoop_css__ metadata:\n{}", output);

    // Metadata should contain the actual CSS rules
    assert!(output.contains("color:blue"), "Expected color:blue in CSS metadata:\n{}", output);
    assert!(output.contains("padding:8px"), "Expected padding:8px in CSS metadata:\n{}", output);
}

#[test]
fn test_css_single_property() {
    let input = r#"
        import { css } from "stoop";
        const cls = css({ display: "flex" });
    "#;
    let output = test_utils::transform(input);

    assert!(!output.contains("css("), "css() call should be replaced:\n{}", output);
    assert!(output.contains("display:flex"), "Expected display:flex in CSS metadata:\n{}", output);
}

#[test]
fn test_css_empty_object() {
    let input = r#"
        import { css } from "stoop";
        const cls = css({});
    "#;
    let output = test_utils::transform(input);

    // Empty css() should produce an empty string
    assert!(!output.contains("css("), "css() call should be replaced:\n{}", output);
}

#[test]
fn test_css_numeric_value() {
    let input = r#"
        import { css } from "stoop";
        const cls = css({ opacity: 0.5 });
    "#;
    let output = test_utils::transform(input);

    assert!(!output.contains("css("), "css() call should be replaced:\n{}", output);
    assert!(output.contains("opacity:0.5"), "Expected opacity:0.5 in CSS metadata:\n{}", output);
}

#[test]
fn test_css_multiple_calls() {
    let input = r#"
        import { css } from "stoop";
        const a = css({ color: "red" });
        const b = css({ color: "blue" });
    "#;
    let output = test_utils::transform(input);

    // Both calls should be replaced
    assert!(!output.contains("css("), "All css() calls should be replaced:\n{}", output);

    // Metadata should contain both rules
    assert!(output.contains("color:red"), "Expected color:red in CSS metadata:\n{}", output);
    assert!(output.contains("color:blue"), "Expected color:blue in CSS metadata:\n{}", output);
}

// =============================================================================
// 6. globalCss() transforms
// =============================================================================

#[test]
fn test_global_css_basic() {
    let input = r#"
        import { globalCss } from "stoop";
        globalCss({
            body: {
                margin: "0",
                padding: "0",
            },
        });
    "#;
    let output = test_utils::transform(input);

    // globalCss() call should be removed (replaced with empty statement)
    assert!(!output.contains("globalCss("), "globalCss() call should be removed:\n{}", output);

    // CSS metadata should contain the global rule
    assert!(output.contains("__stoop_css__"), "Expected __stoop_css__ metadata:\n{}", output);

    // Should contain the global CSS with selector and properties
    assert!(output.contains("body{"), "Expected body selector in CSS metadata:\n{}", output);
    assert!(output.contains("margin:0"), "Expected margin:0 in CSS metadata:\n{}", output);
    assert!(output.contains("padding:0"), "Expected padding:0 in CSS metadata:\n{}", output);

    // Should be marked as global
    assert!(output.contains("\"g\":true"), "Expected global flag in metadata:\n{}", output);
}

#[test]
fn test_global_css_multiple_selectors() {
    let input = r#"
        import { globalCss } from "stoop";
        globalCss({
            body: { margin: "0" },
            html: { boxSizing: "border-box" },
        });
    "#;
    let output = test_utils::transform(input);

    assert!(!output.contains("globalCss("), "globalCss() call should be removed:\n{}", output);
    assert!(output.contains("body{"), "Expected body selector:\n{}", output);
    assert!(output.contains("html{"), "Expected html selector:\n{}", output);
}

#[test]
fn test_global_css_string_selector() {
    let input = r#"
        import { globalCss } from "stoop";
        globalCss({
            "*": { boxSizing: "border-box" },
        });
    "#;
    let output = test_utils::transform(input);

    assert!(!output.contains("globalCss("), "globalCss() call should be removed:\n{}", output);
    assert!(output.contains("__stoop_css__"), "Expected CSS metadata:\n{}", output);
}

// =============================================================================
// 7. keyframes() transforms
// =============================================================================

#[test]
fn test_keyframes_basic() {
    let input = r#"
        import { keyframes } from "stoop";
        const fadeIn = keyframes({
            from: { opacity: "0" },
            to: { opacity: "1" },
        });
    "#;
    let output = test_utils::transform(input);

    // keyframes() should be replaced with a string (the animation name)
    assert!(!output.contains("keyframes("), "keyframes() call should be replaced:\n{}", output);

    // The animation name should be a hashed string starting with 'x'
    // The variable should be assigned to a string literal
    assert!(output.contains("\"x"), "Expected hashed animation name starting with 'x':\n{}", output);

    // CSS metadata should contain @keyframes
    assert!(output.contains("__stoop_css__"), "Expected CSS metadata:\n{}", output);
    assert!(output.contains("@keyframes"), "Expected @keyframes in CSS metadata:\n{}", output);

    // Should contain the keyframe stops
    assert!(output.contains("opacity:0"), "Expected opacity:0 in keyframe:\n{}", output);
    assert!(output.contains("opacity:1"), "Expected opacity:1 in keyframe:\n{}", output);

    // Keyframes should be marked as global
    assert!(output.contains("\"g\":true"), "Expected global flag for keyframes:\n{}", output);
}

#[test]
fn test_keyframes_with_percentage_stops() {
    let input = r#"
        import { keyframes } from "stoop";
        const spin = keyframes({
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
        });
    "#;
    let output = test_utils::transform(input);

    assert!(!output.contains("keyframes("), "keyframes() call should be replaced:\n{}", output);
    assert!(output.contains("@keyframes"), "Expected @keyframes in CSS metadata:\n{}", output);
}

#[test]
fn test_keyframes_deterministic_name() {
    // Same keyframes input should produce the same animation name
    let input = r#"
        import { keyframes } from "stoop";
        const fadeIn = keyframes({
            from: { opacity: "0" },
            to: { opacity: "1" },
        });
    "#;
    let output1 = test_utils::transform(input);
    let output2 = test_utils::transform(input);

    assert_eq!(output1, output2, "Same input should produce identical output");
}

// =============================================================================
// 8. CSS metadata format
// =============================================================================

#[test]
fn test_css_metadata_is_valid_json() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "red",
        });
    "#;
    let output = test_utils::transform(input);

    // The __stoop_css__ metadata is a const containing a JSON string
    assert!(output.contains("__stoop_css__"), "Expected __stoop_css__ in output:\n{}", output);

    // Verify the metadata contains expected JSON structure fields
    // "c" = class name, "s" = CSS string, "p" = priority
    // The JSON is emitted as a string literal, so the inner quotes appear as "
    assert!(output.contains("\"c\":"), "Expected 'c' (class) field in metadata:\n{}", output);
    assert!(output.contains("\"s\":"), "Expected 's' (css) field in metadata:\n{}", output);
    assert!(output.contains("\"p\":"), "Expected 'p' (priority) field in metadata:\n{}", output);
}

#[test]
fn test_css_metadata_contains_correct_css_rules() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "red",
            fontSize: "16px",
        });
    "#;
    let output = test_utils::transform(input);

    // The CSS rules should be minified: .className{property:value}
    assert!(output.contains("color:red"), "Expected color:red in metadata:\n{}", output);
    assert!(output.contains("font-size:16px"), "Expected font-size:16px in metadata (kebab-case):\n{}", output);
}

#[test]
fn test_css_metadata_base_priority() {
    let input = r#"
        import { styled } from "stoop";
        const Box = styled("div", {
            display: "flex",
        });
    "#;
    let output = test_utils::transform(input);

    // Base styles should have priority 0
    assert!(output.contains("\"p\":0"), "Expected priority 0 for base styles:\n{}", output);
}

#[test]
fn test_css_metadata_no_output_when_no_styles() {
    let input = r#"
        const x = 42;
    "#;
    let output = test_utils::transform(input);

    // No stoop usage means no __stoop_css__ metadata
    assert!(!output.contains("__stoop_css__"), "Should not contain metadata when no styles:\n{}", output);
}

// =============================================================================
// 9. Import tracking
// =============================================================================

#[test]
fn test_import_styled_tracked() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", { color: "red" });
    "#;
    let output = test_utils::transform(input);

    // The original stoop import for styled should be replaced
    // New imports for react (forwardRef, createElement) and stoop (clsx, createSelector) should be added
    assert!(output.contains("forwardRef"), "Expected forwardRef import:\n{}", output);
    assert!(output.contains("createElement"), "Expected createElement import:\n{}", output);
    assert!(output.contains("clsx"), "Expected clsx import:\n{}", output);
}

#[test]
fn test_import_css_tracked() {
    let input = r#"
        import { css } from "stoop";
        const cls = css({ color: "blue" });
    "#;
    let output = test_utils::transform(input);

    // css() should be transformed even though styled isn't imported
    assert!(!output.contains("css("), "css() should be replaced:\n{}", output);
    assert!(output.contains("__stoop_css__"), "Expected CSS metadata:\n{}", output);
}

#[test]
fn test_import_renamed() {
    // When the import is renamed, the renamed identifier should still be tracked
    let input = r#"
        import { css as myCss } from "stoop";
        const cls = myCss({ color: "green" });
    "#;
    let output = test_utils::transform(input);

    // The renamed css function should still be transformed
    assert!(!output.contains("myCss("), "Renamed css() should be replaced:\n{}", output);
    assert!(output.contains("color:green"), "Expected color:green in metadata:\n{}", output);
}

#[test]
fn test_import_multiple_apis() {
    let input = r#"
        import { styled, css, globalCss, keyframes } from "stoop";
        const Button = styled("button", { color: "red" });
        const cls = css({ padding: "8px" });
        globalCss({ body: { margin: "0" } });
        const fadeIn = keyframes({ from: { opacity: "0" }, to: { opacity: "1" } });
    "#;
    let output = test_utils::transform(input);

    // All APIs should be transformed
    assert!(!output.contains("styled("), "styled() should be replaced:\n{}", output);
    assert!(!output.contains("css({"), "css() should be replaced:\n{}", output);
    assert!(!output.contains("globalCss("), "globalCss() should be removed:\n{}", output);
    assert!(!output.contains("keyframes({"), "keyframes() should be replaced:\n{}", output);

    // Metadata should have entries from all APIs
    assert!(output.contains("color:red"), "Expected styled CSS:\n{}", output);
    assert!(output.contains("padding:8px"), "Expected css CSS:\n{}", output);
    assert!(output.contains("body{"), "Expected global CSS:\n{}", output);
    assert!(output.contains("@keyframes"), "Expected keyframes CSS:\n{}", output);
}

#[test]
fn test_react_imports_added() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", { color: "red" });
    "#;
    let output = test_utils::transform(input);

    // React imports should be added when styled() is used
    assert!(output.contains("\"react\""), "Expected react import source:\n{}", output);
    assert!(output.contains("forwardRef"), "Expected forwardRef import:\n{}", output);
    assert!(output.contains("createElement"), "Expected createElement import:\n{}", output);
}

#[test]
fn test_runtime_imports_added() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", { color: "red" });
    "#;
    let output = test_utils::transform(input);

    // Runtime imports (clsx, createSelector) should be added when styled() is used
    assert!(output.contains("clsx"), "Expected clsx import:\n{}", output);
    assert!(output.contains("createSelector"), "Expected createSelector import:\n{}", output);
}

// =============================================================================
// 10. Token resolution
// =============================================================================

#[test]
fn test_token_resolution_explicit_path() {
    // $colors.red should resolve to var(--colors-red)
    let input = r#"
        import { styled } from "stoop";
        const Box = styled("div", {
            color: "$colors.red",
        });
    "#;
    let output = test_utils::transform(input);

    assert!(output.contains("var(--colors-red)"), "Expected var(--colors-red) in output:\n{}", output);
}

#[test]
fn test_token_resolution_shorthand_fallback() {
    // $primary without a theme definition should resolve to var(--primary)
    let input = r#"
        import { styled } from "stoop";
        const Box = styled("div", {
            color: "$primary",
        });
    "#;
    let output = test_utils::transform(input);

    // Without theme config, the token should fall back to a plain variable
    assert!(output.contains("var(--primary)"), "Expected var(--primary) in output:\n{}", output);
}

#[test]
fn test_token_resolution_in_css_call() {
    // Tokens should also be resolved in css() calls (they go through extract_flat_styles
    // which doesn't do token resolution, so the raw token string is used as-is)
    let input = r#"
        import { css } from "stoop";
        const cls = css({ color: "$colors.blue" });
    "#;
    let output = test_utils::transform(input);

    // css() uses extract_flat_styles which passes raw values, so the token is literal
    // The $colors.blue should appear in the CSS metadata as-is
    assert!(output.contains("$colors.blue"), "Expected raw token in css() output:\n{}", output);
}

#[test]
fn test_token_in_styled_becomes_css_variable() {
    let input = r#"
        import { styled } from "stoop";
        const Box = styled("div", {
            borderRadius: "$radii.sm",
        });
    "#;
    let output = test_utils::transform(input);

    // Explicit token path should resolve to var(--radii-sm)
    assert!(output.contains("var(--radii-sm)"), "Expected var(--radii-sm) in output:\n{}", output);
}

// =============================================================================
// 11. Nested selectors (pseudo-classes, media queries)
// =============================================================================

#[test]
fn test_styled_with_hover_pseudo() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "blue",
            "&:hover": {
                color: "red",
            },
        });
    "#;
    let output = test_utils::transform(input);

    // Pseudo-class styles should be in the CSS metadata
    assert!(output.contains(":hover"), "Expected :hover in CSS metadata:\n{}", output);
    assert!(output.contains("color:red"), "Expected hover color:red:\n{}", output);
}

#[test]
fn test_styled_with_media_query() {
    let input = r#"
        import { styled } from "stoop";
        const Box = styled("div", {
            padding: "8px",
            "@media (min-width: 768px)": {
                padding: "16px",
            },
        });
    "#;
    let output = test_utils::transform(input);

    // Media query should appear in CSS metadata
    assert!(output.contains("@media"), "Expected @media in CSS metadata:\n{}", output);
    assert!(output.contains("padding:16px"), "Expected responsive padding:16px:\n{}", output);
}

// =============================================================================
// 12. Edge cases and misc
// =============================================================================

#[test]
fn test_exported_styled_component() {
    let input = r#"
        import { styled } from "stoop";
        export const Button = styled("button", {
            color: "red",
        });
    "#;
    let output = test_utils::transform(input);

    // Exported components should still be transformed
    assert!(output.contains("forwardRef"), "Expected forwardRef for exported component:\n{}", output);
    assert!(!output.contains("styled("), "styled() should be replaced for exports:\n{}", output);
}

#[test]
fn test_deterministic_output() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "red",
            fontSize: "16px",
        });
    "#;

    let output1 = test_utils::transform(input);
    let output2 = test_utils::transform(input);

    assert_eq!(output1, output2, "Transform should be deterministic");
}

#[test]
fn test_selector_class_generated() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "red",
        });
    "#;
    let output = test_utils::transform(input);

    // styled() components get a selector class via createSelector
    assert!(output.contains("createSelector"), "Expected createSelector for selector class:\n{}", output);
    assert!(output.contains("selector"), "Expected selector property:\n{}", output);
    assert!(output.contains("Object.assign"), "Expected Object.assign pattern:\n{}", output);
}

#[test]
fn test_as_prop_destructured() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "red",
        });
    "#;
    let output = test_utils::transform(input);

    // The 'as' prop should always be destructured for polymorphic support
    // and used in the element expression with || fallback
    assert!(output.contains("as"), "Expected 'as' prop in output:\n{}", output);
}

#[test]
fn test_ref_forwarding() {
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            color: "red",
        });
    "#;
    let output = test_utils::transform(input);

    // The component should accept a ref parameter and pass it to createElement
    assert!(output.contains("ref"), "Expected ref handling in output:\n{}", output);
    assert!(output.contains("forwardRef"), "Expected forwardRef:\n{}", output);
}

#[test]
fn test_camel_case_to_kebab_case_in_css() {
    let input = r#"
        import { styled } from "stoop";
        const Box = styled("div", {
            backgroundColor: "blue",
            borderRadius: "4px",
            marginTop: "8px",
        });
    "#;
    let output = test_utils::transform(input);

    // CSS properties should be in kebab-case in the metadata
    assert!(output.contains("background-color:blue"), "Expected kebab-case background-color:\n{}", output);
    assert!(output.contains("border-radius:4px"), "Expected kebab-case border-radius:\n{}", output);
    assert!(output.contains("margin-top:8px"), "Expected kebab-case margin-top:\n{}", output);
}

#[test]
fn test_non_stoop_code_unchanged() {
    let input = r#"
        const x = 42;
        function hello() { return "world"; }
    "#;
    let output = test_utils::transform(input);

    // Non-stoop code should pass through unchanged (modulo formatting)
    assert!(output.contains("42"), "Regular code should be preserved:\n{}", output);
    assert!(output.contains("hello"), "Function should be preserved:\n{}", output);
    assert!(!output.contains("__stoop_css__"), "No metadata for non-stoop code:\n{}", output);
}

#[test]
fn test_styled_and_css_together() {
    let input = r#"
        import { styled, css } from "stoop";
        const Button = styled("button", { color: "red" });
        const extra = css({ fontWeight: "bold" });
    "#;
    let output = test_utils::transform(input);

    // Both should be transformed
    assert!(!output.contains("styled("), "styled() should be replaced:\n{}", output);
    assert!(!output.contains("css({"), "css() should be replaced:\n{}", output);
    assert!(output.contains("forwardRef"), "Expected forwardRef:\n{}", output);
    assert!(output.contains("color:red"), "Expected styled CSS:\n{}", output);
    assert!(output.contains("font-weight:bold"), "Expected css CSS:\n{}", output);
}

#[test]
fn test_complete_variant_pipeline() {
    // A comprehensive test combining base styles, variants, defaultVariants, and compoundVariants
    let input = r#"
        import { styled } from "stoop";
        const Button = styled("button", {
            display: "inline-flex",
            variants: {
                size: {
                    sm: { padding: "4px" },
                    lg: { padding: "16px" },
                },
                intent: {
                    primary: { backgroundColor: "blue" },
                    danger: { backgroundColor: "red" },
                },
            },
            defaultVariants: {
                size: "sm",
            },
            compoundVariants: [
                {
                    size: "lg",
                    intent: "danger",
                    css: { border: "2px solid red" },
                },
            ],
        });
    "#;
    let output = test_utils::transform(input);

    // Base styles
    assert!(output.contains("display:inline-flex"), "Expected base display:\n{}", output);

    // Variant conditionals
    assert!(output.contains("\"sm\""), "Expected 'sm' variant value:\n{}", output);
    assert!(output.contains("\"lg\""), "Expected 'lg' variant value:\n{}", output);
    assert!(output.contains("\"primary\""), "Expected 'primary' variant value:\n{}", output);
    assert!(output.contains("\"danger\""), "Expected 'danger' variant value:\n{}", output);

    // Default variant (undefined check)
    assert!(output.contains("undefined"), "Expected undefined check for default variant:\n{}", output);

    // Compound variant CSS
    assert!(output.contains("border:2px solid red"), "Expected compound variant border:\n{}", output);

    // Component structure
    assert!(output.contains("forwardRef"), "Expected forwardRef:\n{}", output);
    assert!(output.contains("createElement"), "Expected createElement:\n{}", output);
    assert!(output.contains("clsx"), "Expected clsx:\n{}", output);
}
