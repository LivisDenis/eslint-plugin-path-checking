/**
 * @fileoverview Absolute import is allowed only from public api
 * @author livis
 */
"use strict";

const { isPathRelative } = require('../helpers')
const micromatch = require('micromatch');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Absolute import is allowed only from public api",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          testFilePatterns: {
            type: 'array'
          }
        }
      }
    ],
  },

  create(context) {
    const {alias = '', testFilePatterns = []} = context.options[0] ?? {};

    const allowedLayers = {
      'pages': 'pages',
      'widgets': 'widgets',
      'features': 'features',
      'entities': 'entities',
    }

    return {
      ImportDeclaration(node) {
        // example entities/Article
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value

        if (isPathRelative(importTo)) {
          return;
        }

        const segments = importTo.split('/')
        const layer = segments[0]

        if (!allowedLayers[layer]) {
            return;
        }

        const isImportNotFromPublicApi = segments.length > 2

        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report(node, 'Absolute import is allowed only from Public Api (index.ts)');
        }

        if (isTestingPublicApi) {
          // example /Users/macos/Documents/projects/me/src/entities/Article
          const getFilename = context.getFilename()

          const isCurrentFileTesting = testFilePatterns.some(
              (pattern) => micromatch.isMatch(getFilename, pattern)
          )

          if (!isCurrentFileTesting) {
            context.report(node, 'Test data should be imported only from Public Api (testing.ts)');
          }
        }
      }
    };
  },
};
