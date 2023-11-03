module.exports = function ({ types }) {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            ImportDeclaration(path) {
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
                    types.stringLiteral("antd/lib/" + name.toLowerCase())
                  );
                  path.replaceWith(importDeclaration);
                });
              }
            },
          });
        },
      },
    },
  };
};
