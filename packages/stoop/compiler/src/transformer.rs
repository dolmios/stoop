use swc_core::ecma::ast::*;
use swc_core::common::{DUMMY_SP, SyntaxContext};
use swc_core::ecma::utils::quote_ident;

use crate::config::StoopConfig;
use crate::types::{StyleExtraction, AtomicCSSOutput};

pub struct ComponentTransformer;

impl ComponentTransformer {
    pub fn new(_config: &StoopConfig) -> Self {
        Self
    }

    pub fn create_component(
        &self,
        extraction: &StyleExtraction,
        css_output: &AtomicCSSOutput,
    ) -> Expr {
        let component_fn = self.create_component_function(extraction, css_output);

        // Use forwardRef from React (assumed to be imported)
        let forward_ref_call = Expr::Call(CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(Box::new(Expr::Ident(quote_ident!("forwardRef").into()))),
            args: vec![ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Arrow(component_fn)),
            }],
            type_args: None,
        });

        // Attach selector property if selector_class exists
        if !css_output.selector_class.is_empty() {
            // Create selector object using createSelector
            let selector_obj = Expr::Call(CallExpr {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                callee: Callee::Expr(Box::new(Expr::Ident(quote_ident!("createSelector").into()))),
                args: vec![ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: css_output.selector_class.clone().into(),
                        raw: None,
                    }))),
                }],
                type_args: None,
            });

            // Use Object.assign pattern: Object.assign(forwardRef(...), { selector: createSelector(...) })
            Expr::Call(CallExpr {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(Expr::Ident(quote_ident!("Object").into())),
                    prop: MemberProp::Ident(quote_ident!("assign").into()),
                }))),
                args: vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(forward_ref_call),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(quote_ident!("selector").into()),
                                value: Box::new(selector_obj),
                            })))],
                        })),
                    },
                ],
                type_args: None,
            })
        } else {
            forward_ref_call
        }
    }

    fn create_component_function(
        &self,
        extraction: &StyleExtraction,
        css_output: &AtomicCSSOutput,
    ) -> ArrowExpr {
        let params = vec![
            Pat::Ident(BindingIdent {
                id: quote_ident!("props").into(),
                type_ann: None,
            }),
            Pat::Ident(BindingIdent {
                id: quote_ident!("ref").into(),
                type_ann: None,
            }),
        ];

        let body = self.create_function_body(extraction, css_output);

        ArrowExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            params,
            body: Box::new(BlockStmtOrExpr::BlockStmt(body)),
            is_async: false,
            is_generator: false,
            type_params: None,
            return_type: None,
        }
    }

    fn create_function_body(
        &self,
        extraction: &StyleExtraction,
        css_output: &AtomicCSSOutput,
    ) -> BlockStmt {
        let mut stmts = vec![];

        stmts.push(self.create_destructuring(extraction, css_output));
        stmts.push(self.create_classname_stmt(css_output, extraction));
        stmts.push(self.create_return_stmt(extraction));

        BlockStmt {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            stmts,
        }
    }

    fn create_destructuring(&self, extraction: &StyleExtraction, css_output: &AtomicCSSOutput) -> Stmt {
        let mut props = vec![];

        // Extract 'as' prop for polymorphic components
        props.push(ObjectPatProp::Assign(AssignPatProp {
            span: DUMMY_SP,
            key: quote_ident!("as").into(),
            value: None,
        }));

        // Collect all variant prop names that need destructuring
        let mut variant_names: std::collections::HashSet<String> = std::collections::HashSet::new();

        // Extract variant props from extraction
        for variant_name in extraction.variants.keys() {
            variant_names.insert(variant_name.clone());
        }

        // Also extract compound variant condition keys
        for compound in &css_output.compound_variant_classes {
            for (cond_key, _) in &compound.conditions {
                variant_names.insert(cond_key.clone());
            }
        }

        // Also extract default variant keys
        for key in css_output.default_variants.keys() {
            variant_names.insert(key.clone());
        }

        // Sort for deterministic output
        let mut sorted_names: Vec<String> = variant_names.into_iter().collect();
        sorted_names.sort();

        for variant_name in &sorted_names {
            props.push(ObjectPatProp::Assign(AssignPatProp {
                span: DUMMY_SP,
                key: BindingIdent {
                    id: Ident::new(variant_name.clone().into(), DUMMY_SP, SyntaxContext::empty()),
                    type_ann: None,
                },
                value: None,
            }));
        }

        props.push(ObjectPatProp::Assign(AssignPatProp {
            span: DUMMY_SP,
            key: quote_ident!("className").into(),
            value: None,
        }));

        props.push(ObjectPatProp::Rest(RestPat {
            span: DUMMY_SP,
            dot3_token: DUMMY_SP,
            arg: Box::new(Pat::Ident(BindingIdent {
                id: quote_ident!("rest").into(),
                type_ann: None,
            })),
            type_ann: None,
        }));

        Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Object(ObjectPat {
                    span: DUMMY_SP,
                    props,
                    optional: false,
                    type_ann: None,
                }),
                init: Some(Box::new(Expr::Ident(quote_ident!("props").into()))),
                definite: false,
            }],
        })))
    }

    fn create_classname_stmt(
        &self,
        css_output: &AtomicCSSOutput,
        _extraction: &StyleExtraction,
    ) -> Stmt {
        let mut args = vec![];

        // Base classes: join all atomic class names into a single space-separated string
        if !css_output.base_classes.is_empty() {
            let base_class_str = css_output
                .base_classes
                .iter()
                .map(|r| r.class_name.as_str())
                .collect::<Vec<&str>>()
                .join(" ");
            args.push(self.string_literal(&base_class_str));
        }

        // Variant conditionals: variant_name === "value" && "atomic classes"
        let mut variant_keys: Vec<&String> = css_output.variant_classes.keys().collect();
        variant_keys.sort();
        for variant_name in variant_keys {
            let variant_values = &css_output.variant_classes[variant_name];
            let mut value_keys: Vec<&String> = variant_values.keys().collect();
            value_keys.sort();
            for value_name in value_keys {
                let rules = &variant_values[value_name];
                let classes_str = rules
                    .iter()
                    .map(|r| r.class_name.as_str())
                    .collect::<Vec<&str>>()
                    .join(" ");
                args.push(self.create_variant_conditional(
                    variant_name,
                    value_name,
                    &classes_str,
                ));
            }
        }

        // Default variant conditionals: variant_name === undefined && "default classes"
        let mut default_keys: Vec<&String> = css_output.default_variants.keys().collect();
        default_keys.sort();
        for variant_name in default_keys {
            let default_value = &css_output.default_variants[variant_name];
            // Look up the classes for this default value from variant_classes
            if let Some(variant_values) = css_output.variant_classes.get(variant_name) {
                if let Some(rules) = variant_values.get(default_value) {
                    let classes_str = rules
                        .iter()
                        .map(|r| r.class_name.as_str())
                        .collect::<Vec<&str>>()
                        .join(" ");
                    args.push(self.create_undefined_conditional(variant_name, &classes_str));
                }
            }
        }

        // Compound variant conditionals: cond1 === val1 && cond2 === val2 && "classes"
        for compound in &css_output.compound_variant_classes {
            if compound.conditions.is_empty() || compound.rules.is_empty() {
                continue;
            }
            let classes_str = compound
                .rules
                .iter()
                .map(|r| r.class_name.as_str())
                .collect::<Vec<&str>>()
                .join(" ");
            args.push(self.create_compound_variant_conditional(&compound.conditions, &classes_str));
        }

        // Append user className
        args.push(ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Ident(quote_ident!("className").into())),
        });

        let clsx_call = Expr::Call(CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(Box::new(Expr::Ident(quote_ident!("clsx").into()))),
            args,
            type_args: None,
        });

        Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(BindingIdent {
                    id: quote_ident!("finalClassName").into(),
                    type_ann: None,
                }),
                init: Some(Box::new(clsx_call)),
                definite: false,
            }],
        })))
    }

    fn create_variant_conditional(
        &self,
        variant_name: &str,
        value_name: &str,
        class_names: &str,
    ) -> ExprOrSpread {
        let variant_ident = Expr::Ident(Ident::new(variant_name.into(), DUMMY_SP, SyntaxContext::empty()));

        // Handle boolean variants: "true" or "false" strings
        let right_expr = if value_name == "true" {
            Expr::Lit(Lit::Bool(Bool { span: DUMMY_SP, value: true }))
        } else if value_name == "false" {
            Expr::Lit(Lit::Bool(Bool { span: DUMMY_SP, value: false }))
        } else {
            // String comparison (default)
            Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: value_name.into(),
                raw: None,
            }))
        };

        let comparison = Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::EqEqEq,
            left: Box::new(variant_ident),
            right: Box::new(right_expr),
        });

        ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::LogicalAnd,
                left: Box::new(comparison),
                right: Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: class_names.into(),
                    raw: None,
                }))),
            })),
        }
    }

    /// Creates: variant_name === undefined && "class_names"
    fn create_undefined_conditional(
        &self,
        variant_name: &str,
        class_names: &str,
    ) -> ExprOrSpread {
        let variant_ident = Expr::Ident(Ident::new(variant_name.into(), DUMMY_SP, SyntaxContext::empty()));

        let comparison = Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::EqEqEq,
            left: Box::new(variant_ident),
            right: Box::new(Expr::Ident(quote_ident!("undefined").into())),
        });

        ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::LogicalAnd,
                left: Box::new(comparison),
                right: Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: class_names.into(),
                    raw: None,
                }))),
            })),
        }
    }

    /// Creates: cond1 === val1 && cond2 === val2 && ... && "class_names"
    fn create_compound_variant_conditional(
        &self,
        conditions: &[(String, String)],
        class_names: &str,
    ) -> ExprOrSpread {
        // Build comparisons for each condition
        let mut comparisons: Vec<Expr> = conditions
            .iter()
            .map(|(key, value)| {
                let ident = Expr::Ident(Ident::new(key.clone().into(), DUMMY_SP, SyntaxContext::empty()));

                let right_expr = if value == "true" {
                    Expr::Lit(Lit::Bool(Bool { span: DUMMY_SP, value: true }))
                } else if value == "false" {
                    Expr::Lit(Lit::Bool(Bool { span: DUMMY_SP, value: false }))
                } else {
                    Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: value.clone().into(),
                        raw: None,
                    }))
                };

                Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    op: BinaryOp::EqEqEq,
                    left: Box::new(ident),
                    right: Box::new(right_expr),
                })
            })
            .collect();

        // Chain all comparisons with && and end with the class string
        // Start from the last comparison and fold right with the class string at the end
        let class_expr = Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: class_names.into(),
            raw: None,
        }));

        // Build the chain: cond1 && cond2 && ... && "classes"
        // We fold from right to left
        let mut result = class_expr;
        for comparison in comparisons.drain(..).rev() {
            result = Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::LogicalAnd,
                left: Box::new(comparison),
                right: Box::new(result),
            });
        }

        ExprOrSpread {
            spread: None,
            expr: Box::new(result),
        }
    }

    fn create_return_stmt(&self, extraction: &StyleExtraction) -> Stmt {
        // Determine element: use 'as' prop if provided, otherwise use extracted element
        // If element is not a string (component composition), use it directly
        let element_expr = if extraction.element == "div" || extraction.element.chars().all(|c| c.is_alphanumeric() || c == '-') {
            // String element - use 'as' prop or element
            Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::LogicalOr,
                left: Box::new(Expr::Ident(quote_ident!("as").into())),
                right: Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: extraction.element.clone().into(),
                    raw: None,
                }))),
            })
        } else {
            // Component reference - use element directly (it's already an identifier)
            // This handles component composition: styled(Button, {...})
            Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::LogicalOr,
                left: Box::new(Expr::Ident(quote_ident!("as").into())),
                right: Box::new(Expr::Ident(Ident::new(
                    extraction.element.clone().into(),
                    DUMMY_SP,
                    SyntaxContext::empty(),
                ))),
            })
        };

        let props = vec![
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("ref").into()),
                value: Box::new(Expr::Ident(quote_ident!("ref").into())),
            }))),
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("className").into()),
                value: Box::new(Expr::Ident(quote_ident!("finalClassName").into())),
            }))),
            PropOrSpread::Spread(SpreadElement {
                dot3_token: DUMMY_SP,
                expr: Box::new(Expr::Ident(quote_ident!("rest").into())),
            }),
        ];

        // Use createElement directly (will be available from React import in runtime)
        let call_expr = Expr::Call(CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(Box::new(Expr::Ident(quote_ident!("createElement").into()))),
            args: vec![
                ExprOrSpread {
                    spread: None,
                    expr: Box::new(element_expr),
                },
                ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props,
                    })),
                },
            ],
            type_args: None,
        });

        Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(call_expr)),
        })
    }

    fn string_literal(&self, value: &str) -> ExprOrSpread {
        ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: value.into(),
                raw: None,
            }))),
        }
    }
}
