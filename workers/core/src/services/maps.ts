import { nonNilFilter } from '@a-type/utils';
import { BiscuitsError } from '@biscuits/error';
import { randomUUID } from 'crypto';

export interface AutocompleteSuggestion {
	place: string;
	placeId: string;
	text: {
		text: string;
		matches: { endOffset: number }[];
	};
	structuredFormat: {
		mainText: {
			text: string;
			matches: { endOffset: number }[];
		};
		secondaryText: {
			text: string;
		};
	};
	types: string[];
}

export interface PlaceLocationDetails {
	id: string;
	latitude: number;
	longitude: number;
	shortFormattedAddress: string;
}

export interface ReverseGeocodeResult {
	formatted_address: string;
	address_components: {
		long_name: string;
		short_name: string;
		types: string[];
	}[];
	types: string[];
	place_id: string;
}

export class Maps {
	constructor(private key: string) {}

	private autocompleteSessionTokens = new Map<string, string>();

	/**
	 * Suggests potential places based on a search input.
	 * Automatically tracks autocomplete sessions based on user ID.
	 */
	autocomplete = async (input: string, ctx: { userId?: string }) => {
		let sessionToken =
			ctx.userId ? this.autocompleteSessionTokens.get(ctx.userId) : undefined;
		if (!sessionToken && ctx.userId) {
			sessionToken = randomUUID();
			this.autocompleteSessionTokens.set(ctx.userId, sessionToken);
		}
		const result = await fetch(
			`https://places.googleapis.com/v1/places:autocomplete`,
			{
				method: 'post',
				body: JSON.stringify({
					input,
					includedPrimaryTypes: [
						'locality',
						'administrative_area_level_1',
						'administrative_area_level_2',
						'landmark',
						'natural_feature',
					],
					sessionToken,
					languageCode: 'en',
				}),
				headers: {
					'Content-Type': 'application/json',
					'X-Goog-Api-Key': this.key,
				},
			},
		);

		if (!result.ok) {
			console.error(
				'Failed to fetch autocomplete results',
				result.status,
				await result.text(),
			);
			throw new BiscuitsError(BiscuitsError.Code.Unexpected);
		}

		const data = (await result.json()) as any;
		if (!data.suggestions) return [];
		return data.suggestions
			.map((s: any) => s.placePrediction)
			.filter(nonNilFilter) as AutocompleteSuggestion[];
	};

	/**
	 * Terminates an autocomplete session by fetching
	 * the place's name and lat/lng coordinates.
	 */
	placeLocationDetails = async (placeId: string) => {
		const sessionToken = this.autocompleteSessionTokens.get(placeId);
		const params = new URLSearchParams();
		if (sessionToken) {
			params.set('sessionToken', sessionToken);
		}
		params.set('languageCode', 'en');
		const result = await fetch(
			`https://places.googleapis.com/v1/places/${placeId}?${params.toString()}`,
			{
				method: 'get',
				headers: {
					'X-Goog-Api-Key': this.key,
					'X-Goog-FieldMask': 'id,location,shortFormattedAddress',
					'X-Goog-LanguageCode': 'en',
				},
			},
		);

		if (!result.ok) {
			console.error(
				'Failed to fetch place details',
				result.status,
				await result.text(),
			);
			throw new BiscuitsError(BiscuitsError.Code.Unexpected);
		}

		const data = (await result.json()) as any;
		return {
			id: data.id,
			latitude: data.location.latitude,
			longitude: data.location.longitude,
			shortFormattedAddress: data.shortFormattedAddress,
		} as PlaceLocationDetails;
	};

	reverseGeocode = async (
		latitude: number,
		longitude: number,
	): Promise<ReverseGeocodeResult | null> => {
		const result = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.key}`,
			{
				method: 'get',
			},
		);

		if (!result.ok) {
			console.error(
				'Failed to fetch reverse geocode',
				result.status,
				await result.text(),
			);
			throw new BiscuitsError(BiscuitsError.Code.Unexpected);
		}

		const data = (await result.json()) as any;
		return data.results?.[0] || null;
	};
}
