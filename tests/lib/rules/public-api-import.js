/**
 * @fileoverview Absolute import is allowed only from public api
 * @author livis
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-import"),
    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const aliasOptions = [
    {
        alias: '@'
    }
]

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
    },
});
ruleTester.run("public-api-import", rule, {
    valid: [
        {
            code: "import { Article } from '../../model/slice';",
        },
        {
            code: "import { Article } from 'shared/Article/model/slice';",
        },
        {
            code: "import { Article } from '@/entities/Article';",
            options: aliasOptions,
        },
        {
            filename: "/Users/macos/Documents/projects/me/src/pages/Article/file.test.ts",
            code: "import { Article } from '@/entities/Comment/testing';",
            options: [
                {
                    alias: '@',
                    testFilePatterns: [
                        '**/*.test.*',
                        '**/StoreDecorator.tsx',
                        '**/*.story.*',
                    ],
                }
            ],
        },
        {
            filename: "/Users/macos/Documents/projects/me/src/pages/Article/StoreDecorator.tsx",
            code: "import { Article } from '@/entities/Comment/testing';",
            options: [
                {
                    alias: '@',
                    testFilePatterns: [
                        '**/*.test.*',
                        '**/StoreDecorator.tsx',
                        '**/*.story.*',
                    ],
                }
            ],
        }
    ],

    invalid: [
        {
            code: "import { Article } from 'entities/Article/model/slice';",
            errors: [{message: "Absolute import is allowed only from Public Api (index.ts)"}],
        },
        {
            code: "import { Article } from '@/entities/Article/model/slice';",
            errors: [{message: "Absolute import is allowed only from Public Api (index.ts)"}],
            options: aliasOptions,
        },
        {
            filename: "/Users/macos/Documents/projects/me/src/pages/Article/model/slice.ts",
            code: "import { Article } from '@/entities/Comment/testing';",
            errors: [{message: "Test data should be imported only from Public Api (testing.ts)"}],
            options: [
                {
                    alias: '@',
                    testFilePatterns: [
                        '**/*.test.*',
                        '**/StoreDecorator.tsx',
                        '**/*.story.*',
                    ],
                }
            ],
        },
        {
            filename: "/Users/macos/Documents/projects/me/src/pages/Article/model/StoreDecorator.tsx",
            code: "import { Article } from '@/entities/Comment/testing/file.tsx';",
            errors: [{message: "Absolute import is allowed only from Public Api (index.ts)"}],
            options: [
                {
                    alias: '@',
                    testFilePatterns: [
                        '**/*.test.*',
                        '**/StoreDecorator.tsx',
                        '**/*.story.*',
                    ],
                }
            ],
        }
    ],
});
