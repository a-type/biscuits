import { TemperatureUnit } from '../../../services/weather.js';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
	weatherForecast: t.field({
		description:
			'Get a weather forecast for a location over a given time period',
		type: 'WeatherForecast',
		authScopes: {
			member: true,
		},
		args: {
			input: t.arg({
				type: 'WeatherForecastInput',
				required: true,
			}),
		},
		nullable: false,
		resolve: async (_, { input }, { weather }) => {
			return weather.getForecast(input);
		},
	}),

	locationAutocomplete: t.field({
		description: 'Suggest completions for a location based on a search string',
		type: ['LocationAutocompleteSuggestion'],
		authScopes: {
			member: true,
		},
		args: {
			search: t.arg.string({
				required: true,
			}),
		},
		nullable: false,
		resolve: async (_, { search }, ctx) => {
			return ctx.maps.autocomplete(search, { userId: ctx.session?.userId });
		},
	}),

	geographicLocation: t.field({
		description:
			'Get the latitude and longitude of a location identified by location autocomplete',
		type: 'GeographicResult',
		authScopes: {
			member: true,
		},
		args: {
			placeId: t.arg.string({
				required: true,
			}),
		},
		nullable: false,
		resolve: async (_, { placeId }, ctx) => {
			return ctx.maps.placeLocationDetails(placeId);
		},
	}),
}));

builder.objectType('WeatherForecast', {
	description: 'Weather forecast for a location over a given time period',
	fields: (t) => ({
		days: t.expose('days', {
			type: ['WeatherForecastDay'],
			nullable: false,
		}),
		error: t.exposeString('error', {
			nullable: true,
		}),
		high: t.float({
			nullable: false,
			resolve: (parent) => {
				return parent.days.reduce(
					(max, day) => Math.max(max, day.high),
					-Infinity,
				);
			},
		}),
		low: t.float({
			nullable: false,
			resolve: (parent) => {
				return parent.days.reduce(
					(min, day) => Math.min(min, day.low),
					Infinity,
				);
			},
		}),
		maxPrecipitationMM: t.float({
			nullable: false,
			resolve: (parent) => {
				return parent.days.reduce(
					(max, day) => Math.max(max, day.precipitationMM),
					-Infinity,
				);
			},
		}),
		willRain: t.boolean({
			nullable: false,
			resolve: (parent) => {
				return parent.days.some((day) => day.precipitationMM > 3);
			},
		}),
		rainyDays: t.int({
			nullable: false,
			resolve: (parent) => {
				return parent.days.filter((day) => day.precipitationMM > 3).length;
			},
		}),
		temperatureUnit: t.field({
			type: TemperatureUnit,
			nullable: false,
			resolve: (parent) => parent.days[0].temperatureUnit,
		}),
	}),
});

builder.objectType('WeatherForecastDay', {
	description: 'Weather forecast for a single day',
	fields: (t) => ({
		date: t.field({
			type: 'Date',
			nullable: false,
			resolve: (parent) => parent.date,
		}),
		high: t.exposeFloat('high', {
			nullable: false,
		}),
		low: t.exposeFloat('low', {
			nullable: false,
		}),
		precipitationMM: t.exposeFloat('precipitationMM', {
			nullable: false,
		}),
		temperatureUnit: t.expose('temperatureUnit', {
			type: TemperatureUnit,
			nullable: false,
		}),
		willRain: t.boolean({
			nullable: false,
			resolve: (parent) => parent.precipitationMM > 3,
		}),
	}),
});

builder.objectType('GeographicResult', {
	description: 'Geographic location result',
	fields: (t) => ({
		id: t.exposeString('id', {
			nullable: false,
		}),
		latitude: t.exposeFloat('latitude', {
			nullable: false,
		}),
		longitude: t.exposeFloat('longitude', {
			nullable: false,
		}),
		address: t.exposeString('shortFormattedAddress', {
			nullable: false,
		}),
	}),
});

builder.objectType('LocationAutocompleteSuggestion', {
	description: 'Location autocomplete suggestion',
	fields: (t) => ({
		placeId: t.exposeString('placeId', {
			nullable: false,
		}),
		text: t.field({
			type: 'String',
			resolve: (p) => p.text.text,
		}),
	}),
});

builder.inputType('WeatherForecastInput', {
	fields: (t) => ({
		startDate: t.field({
			type: 'Date',
			required: true,
		}),
		endDate: t.field({
			type: 'Date',
			required: true,
		}),
		latitude: t.float({
			required: true,
		}),
		longitude: t.float({
			required: true,
		}),
		temperatureUnits: t.field({
			type: TemperatureUnit,
			required: true,
		}),
	}),
});

builder.enumType(TemperatureUnit, {
	name: 'TemperatureUnit',
});
