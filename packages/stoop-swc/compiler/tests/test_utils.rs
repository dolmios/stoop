use swc_core::ecma::{
    parser::{parse_file_as_module, EsSyntax, Syntax, TsSyntax},
    visit::VisitMutWith,
    codegen::{text_writer::JsWriter, Emitter, Config},
};
use swc_core::common::{FileName, SourceMap, sync::Lrc, GLOBALS};

use stoop_swc_compiler::visitor::StoopVisitor;
use stoop_swc_compiler::config::StoopConfig;

pub fn transform(code: &str) -> String {
    GLOBALS.set(&Default::default(), || {
        let cm = Lrc::new(SourceMap::default());
        let fm = cm.new_source_file(
            Lrc::new(FileName::Custom("test.tsx".into())),
            code.to_string(),
        );

        let mut module = parse_file_as_module(
            &fm,
            Syntax::Typescript(TsSyntax {
                tsx: true,
                decorators: false,
                dts: false,
                no_early_errors: false,
                disallow_ambiguous_jsx_like: false,
            }),
            Default::default(),
            None,
            &mut vec![],
        ).expect("Failed to parse");

        let config = StoopConfig::default();
        let mut visitor = StoopVisitor::new(config);

        module.visit_mut_with(&mut visitor);
        visitor.finalize();

        let mut buf = vec![];
        {
            let writer = JsWriter::new(cm.clone(), "\n", &mut buf, None);
            let mut emitter = Emitter {
                cfg: Config::default(),
                cm: cm.clone(),
                comments: None,
                wr: writer,
            };
            emitter.emit_module(&module).unwrap();
        }

        String::from_utf8(buf).unwrap()
    })
}
