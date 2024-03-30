import {
  TemperatureUnit,
  getForecast,
  getGeographicLocation,
} from '../../../services/weather.js';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
  weatherForecast: t.field({
    type: 'WeatherForecast',
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
  geographicLocations: t.field({
    type: ['GeographicResult'],
    args: {
      search: t.arg.string({
        required: true,
      }),
    },
    nullable: false,
    resolve: async (_, { search }, ctx) => {
      return getGeographicLocation(search);
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
    name: t.exposeString('name', {
      nullable: false,
    }),
    latitude: t.exposeFloat('latitude', {
      nullable: false,
    }),
    longitude: t.exposeFloat('longitude', {
      nullable: false,
    }),
    country: t.exposeString('country', {
      nullable: false,
    }),
    state: t.exposeString('state', {
      nullable: true,
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
