module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "@cgnal/eslint-config/js"
    ],
    "plugins": ["jsdoc"],
    "root": true,
    "settings": {
        "jsdoc": {
            "preferredTypes": {
                "array": "Array",
                "boolean": "Boolean",
                "date": "Date",
                "error": "Error",
                "function": "Function",
                "number": "Number",
                "object": "Object",
                "regexp": "RegExp",
                "string": "String",
                "undefined": "Undefined"
            },
            "tagNamePreference": {
                "arg": "param",
                "argument": "param",
                "augments": "extends",
                "file": "overview",
                "return": "returns"
            }
        }
    },
    "rules": {
        "jsdoc/check-alignment": 2,
        "jsdoc/check-examples": 0,
        "jsdoc/check-indentation": 0,
        "jsdoc/check-param-names": 2,
        "jsdoc/check-syntax": 2,
        "jsdoc/check-tag-names": 2,
        "jsdoc/check-types": 2,
        "jsdoc/implements-on-classes": 0,
        "jsdoc/match-description": 0,
        "jsdoc/newline-after-description": 0,
        "jsdoc/no-types": 0,
        "jsdoc/no-undefined-types": [
            "error", {
                "definedTypes": [
                    "ArrayLike",
                    "ListIteratorCallback",
                    "SuperAgentRequest"
                ]
            }
        ],
        "jsdoc/require-description": 0,
        "jsdoc/require-description-complete-sentence": 0,
        "jsdoc/require-example": 0,
        "jsdoc/require-hyphen-before-param-description": 0,
        "jsdoc/require-jsdoc": [
            "error", {
                "require": {
                    "ArrowFunctionExpression": true,
                    "ClassDeclaration": true,
                    "ClassExpression": true,
                    "FunctionDeclaration": true,
                    "FunctionExpression": true,
                    "MethodDefinition": true
                }
            }
        ],
        "jsdoc/require-param": 2,
        "jsdoc/require-param-description": 0,
        "jsdoc/require-param-name": 2,
        "jsdoc/require-param-type": 2,
        "jsdoc/require-returns": 2,
        "jsdoc/require-returns-check": 2,
        "jsdoc/require-returns-description": 0,
        "jsdoc/require-returns-type": 2,
        "jsdoc/valid-types": 0
    }
};
