// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

const base = withNuxt();

export default [
	// ... existing code ...
	...(Array.isArray(base) ? base : [base]),
	{
		rules: {
			// Allow multiple root nodes in Vue templates
			'vue/no-multiple-template-root': 'off',
		},
	},
];
