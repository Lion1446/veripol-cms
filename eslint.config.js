import { defineConfig } from "eslint-define-config";

export default defineConfig({
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"airbnb",
		"airbnb-typescript",
		"airbnb/hooks",
		"prettier",
		"plugin:prettier/recommended",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.json", // path of tsconfig file
	},
	plugins: ["react-refresh", "prettier"],
	rules: {
		"prettier/prettier": ["error"],
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true },
		],
		"react/react-in-jsx-scope": "off",
		"linebreak-style": ["error", "unix"], // enforce Unix line endings
	},
});
