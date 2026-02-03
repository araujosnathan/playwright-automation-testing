/**
 * Custom ESLint rule to detect if a test contains at least one assertion-like call.
 *
 * It matches ANY function containing: verify, assert, check, waitFor, expect
 */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure test has at least one assertion-like call (expect, verify*, assert*, check*, waitFor*)",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      missingAssertion:
        "Test has no assertions. Add expect() or use page object methods: verify*, assert*, check*, waitFor*",
    },
    schema: [],
  },

  create(context) {
    const assertionRegex = /(expect|verify|assert|check|waitFor)/i;
    let insideTest = false;
    let hasAssertion = false;

    return {
      CallExpression(node) {
        // Detect entering a Playwright test function
        if (
          node.callee.name === 'test' ||
          (node.callee.property && node.callee.property.name === 'test')
        ) {
          insideTest = true;
          hasAssertion = false;
          return;
        }

        if (!insideTest) {
          return;
        }

        // Any function that matches the regex counts as assertion
        let functionName = '';

        // Named function -> verifySomething()
        if (node.callee.name) {
          functionName = node.callee.name;
        }

        // Member call -> page.verifySomething()
        if (node.callee.property && node.callee.property.name) {
          functionName = node.callee.property.name;
        }

        if (assertionRegex.test(functionName)) {
          hasAssertion = true;
        }
      },

      'CallExpression:exit'(node) {
        // Leaving a test() block
        if (
          node.callee.name === 'test' ||
          (node.callee.property && node.callee.property.name === 'test')
        ) {
          if (!hasAssertion) {
            context.report({
              node,
              messageId: 'missingAssertion',
            });
          }
          insideTest = false;
        }
      }
    };
  }
};
