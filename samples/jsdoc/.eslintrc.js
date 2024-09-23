module.exports = {
	settings: {
		jsdoc: {
			tagNamePreference: {
				// Allows the non-preferred synonym tag name of `@fires`
				emits: 'emits',
			},
		},
	},
	rules: {
		// The JS package `tracking-jsdoc` changes the definition of the `@fires` tag.
		'jsdoc/no-undefined-types': [
			'error',
			{
				definedTypes: [
					'modal_closed',
					'modal_opened',
					'datepicker_update',
				],
			},
		],
	},
};
