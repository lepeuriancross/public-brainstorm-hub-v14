// Tailwind: Config
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Scripts (node)
import type { Config } from 'tailwindcss';

/*---------- Config ----------*/

// Default config
const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				guest: {
					DEFAULT: '#ef4444',
					dark: '#D33333',
				},
				user: {
					DEFAULT: '#6366f1',
					dark: '#4E51D9',
				},
				moderator: {
					DEFAULT: '#a855f7',
					dark: '#9945E8',
				},
				admin: {
					DEFAULT: '#22C55E',
					dark: '#14B04D',
				},
				warning: {
					DEFAULT: '#ff9259',
					dark: '#e87538',
				},
				error: {
					DEFAULT: '#ef4444',
					dark: '#D33333',
				},
			},
			zIndex: {
				'-1': '-1',
				'10': '10',
				'20': '20',
				'30': '30',
				'40': '40',
				'50': '50',
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};

/*---------- Exports ----------*/

export default config;
