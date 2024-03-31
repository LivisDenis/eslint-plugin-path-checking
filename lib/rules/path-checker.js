"use strict";

const path = require('path')
const { isPathRelative } = require('../helpers')

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "feature sliced relative path checker",
      category: "Fill me in",
      recommended: false,
      url: null,
    },
    fixable: "code",
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
  },

  create(context) {
    const alias = context.options[0]?.alias || '';

    return {
      ImportDeclaration(node) {
        // example entities/Article
        const value = node.source.value

        const importTo = alias ? value.replace(`${alias}/`, '') : value

        // example /Users/macos/Documents/projects/me/src/entities/Article
        const filename = context.getFilename()

        if (shouldBeRelative(filename, importTo)) {
          context.report({
            node,
            message: "Within one slice, all paths must be relative",
            fix: (fixer) => {
              const normalizedPath = getNormalizedPath(filename) // /entities/Article/ui/Article.tsx
                  .split('/')
                  .slice(0, -1)
                  .join('/');
              let relativePath = path.relative(normalizedPath, `/${importTo}`);

              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
              }

              return fixer.replaceText(node.source, `'${relativePath}'`);
            }
          });
        }
      }
    };
  },
};

const layers = {
  'app': 'app',
  'pages': 'pages',
  'widgets': 'widgets',
  'features': 'features',
  'entities': 'entities',
  'shared': 'shared',
}

function getNormalizedPath(currentPath) {
  const normalizePath = path.toNamespacedPath(currentPath)

  return normalizePath.split('src')[1]
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) return false

  // example entities/Article
  const toArray = to.split('/')
  const toLayer = toArray[0] // entities
  const toSlice = toArray[1] // Article

  if (!toLayer || !toSlice || !layers[toLayer]) return false

  const fromProject = getNormalizedPath(from)
  const fromArray = fromProject.split('/')

  const fromLayer = fromArray[1]
  const fromSlice = fromArray[2]

  if (!fromLayer || !fromSlice || !layers[fromLayer]) return false

  return toLayer === fromLayer && toSlice === fromSlice
}

