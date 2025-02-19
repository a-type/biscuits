import { maps } from '../../../services/maps.js';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
	locationAddress: t.field({
		description: 'Get a human-readable address for a geolocation',
		type: 'String',
		authScopes: {
			member: true,
		},
		args: {
			latitude: t.arg.float({ required: true }),
			longitude: t.arg.float({ required: true }),
			format: t.arg({
				type: LocationAddressFormat,
				defaultValue: 'STREET',
			}),
		},
		nullable: true,
		resolve: async (_, { latitude, longitude, format }) => {
			const result = await maps.reverseGeocode(latitude, longitude);
			if (!result) return null;
			if (format === 'STREET') {
				return result.formatted_address;
			}
			if (format === 'CITY') {
				const city = result?.address_components.find(
					(component) =>
						component.types.includes('locality') ||
						component.types.includes('sublocality') ||
						component.types.includes('postal_town') ||
						component.types.includes('administrative_area_level_2'),
				);
				const state = result?.address_components.find((component) =>
					component.types.includes('administrative_area_level_1'),
				);
				const country = result?.address_components.find((component) =>
					component.types.includes('country'),
				);
				let build = city?.long_name ?? city?.short_name ?? '';
				if (state) {
					build += `, ${state?.long_name ?? state?.short_name}`;
				}
				if (country) {
					build += `, ${country?.long_name ?? country?.short_name}`;
				}
				return build;
			}
		},
	}),
}));

const LocationAddressFormat = builder.enumType('LocationAddressFormat', {
	values: ['CITY', 'STREET'] as const,
});
