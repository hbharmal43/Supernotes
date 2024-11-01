import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { 
      globals: globals.browser 
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Turns off React in scope for JSX (for React 17+)
      "react/prop-types": "off", // Turns off PropTypes validation, remove if you need prop validation
      "no-unused-vars": ["warn", { "varsIgnorePattern": "^_" }], // Warns unused vars, ignoring those prefixed with '_'
   
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
