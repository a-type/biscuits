import { maps } from '../../../services/maps.js';
import {
  TemperatureUnit,
  getForecast,
  getGeographicLocation,
} from '../../../services/weather.js';
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
    resolve: async (_, { input }, ctx) => {
      return getForecast(input);
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
      return maps.autocomplete(search, { userId: ctx.session?.userId });
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
      return maps.placeLocationDetails(placeId);
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
  }),
});

builder.objectType('WeatherForecastDay', {
  description: 'Weather forecast for a single day',
  fields: (t) => ({
    date: t.field({
      type: 'DateTime',
      nullable: false,
      resolve: (parent) => new Date(parent.date),
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
      type: 'DateTime',
      required: true,
    }),
    endDate: t.field({
      type: 'DateTime',
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
