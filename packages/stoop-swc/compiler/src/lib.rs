use swc_core::ecma::{
    ast::Program,
    visit::VisitMutWith,
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

mod visitor;
mod extractor;
mod generator;
mod hasher;
mod transformer;
mod writer;
mod config;
mod tokens;
mod types;
mod error;
mod utils;

use visitor::StoopVisitor;
use config::StoopConfig;

#[plugin_transform]
pub fn process_transform(
    mut program: Program,
    metadata: TransformPluginProgramMetadata,
) -> Program {
    let config = StoopConfig::from_metadata(&metadata);
    let mut visitor = StoopVisitor::new(config);

    program.visit_mut_with(&mut visitor);
    visitor.finalize();

    program
}
