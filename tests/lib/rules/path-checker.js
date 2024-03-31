/**
 * @fileoverview features sliced relative path checker
 * @author livis
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: "/Users/macos/Documents/projects/me/src/entities/Article",
      code: "import { Article } from '../../model/slice';",
    }
  ],

  invalid: [
    {
      filename: "/Users/macos/Documents/projects/me/src/entities/Article/ui/Article.tsx",
      code: "import { Article } from 'entities/Article/model/slice';",
      output: "import { Article } from '../model/slice';",
      errors: [{ message: "Within one slice, all paths must be relative"}],
    },
    {
      filename: "/Users/macos/Documents/projects/me/src/entities/Article/ui/Article.tsx",
      code: "import { Article } from '@/entities/Article/model/slice';",
      output: "import { Article } from '../model/slice';",
      errors: [{ message: "Within one slice, all paths must be relative"}],
      options: [
        {
          alias: '@'
        }
      ],
    },
  ],
});
