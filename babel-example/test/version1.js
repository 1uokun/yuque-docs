const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");

const sourceCode = `
    import {Button} from 'antd'
`;

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
  plugins: ["jsx"],
});

traverse(ast, {
  ImportDeclaration(path, state) {
    const { node } = path;
    if (!node) return;

    if (node.source.value === "antd") {
      node.specifiers.forEach((spec) => {
        const name = spec.local.name;
        const importDefaultSpecifier = types.importDefaultSpecifier(
          types.identifier(name)
        );
        const importDeclaration = types.importDeclaration(
          [importDefaultSpecifier],
          types.stringLiteral("antd/lib/"+name.toLowerCase())
        );
        path.replaceWith(importDeclaration);
      });
    }
  },
});

const { code, map } = generate(ast);
console.log(code);
