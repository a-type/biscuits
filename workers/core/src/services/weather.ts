import { BiscuitsError } from '@biscuits/error';
import { compare } from '../dates.js';

export enum TemperatureUnit {
	Celsius = 'C',
	Fahrenheit = 'F',
	Kelvin = 'K',
}

export interface WeatherForecastDay {
	date: string;
	high: number;
	low: number;
	precipitationMM: number;
	temperatureUnit: TemperatureUnit;
}

export interface WeatherForecast {
	days: WeatherForecastDay[];
	error?: string;
}

export interface WeatherForecastInput {
	startDate: string;
	endDate: string;
	latitude: number;
	longitude: number;
	temperatureUnits: TemperatureUnit;
}

export enum WeatherCondition {
	ThunderstormLightRain = 200,
	ThunderstormRain = 201,
	ThunderstormHeavyRain = 202,
	ThunderstormLight = 210,
	Thunderstorm = 211,
	ThunderstormHeavy = 212,
	ThunderstormRagged = 221,
	ThunderstormLightDrizzle = 230,
	ThunderstormDrizzle = 231,
	ThunderstormHeavyDrizzle = 232,

	DrizzleLight = 300,
	Drizzle = 301,
	DrizzleHeavy = 302,
	DrizzleLightRain = 310,
	DrizzleRain = 311,
	DrizzleHeavyRain = 312,
	DrizzleLightShowerRain = 313,
	DrizzleShowerRain = 314,
	DrizzleHeavyShowerRain = 321,

	RainLight = 500,
	Rain = 501,
	RainHeavy = 502,
	RainVeryHeavy = 503,
	RainExtreme = 504,
	RainFreezing = 511,
	RainLightShower = 520,
	RainShower = 521,
	RainHeavyShower = 522,
	RainRaggedShower = 531,

	SnowLight = 600,
	Snow = 601,
	SnowHeavy = 602,
	SnowSleet = 611,
	SnowShowerSleet = 612,
	SnowLightRain = 615,
	SnowRain = 616,
	SnowLightShower = 620,
	SnowShower = 621,
	SnowHeavyShower = 622,

	AtmosphereMist = 701,
	AtmosphereSmoke = 711,
	AtmosphereHaze = 721,
	AtmosphereDust = 731,
	AtmosphereFog = 741,
	AtmosphereSand = 751,
	AtmosphereDustWhirls = 761,
	AtmosphereTornado = 781,

	Clear = 800,

	CloudsFew = 801,
	CloudsScattered = 802,
	CloudsBroken = 803,
	CloudsOvercast = 804,
}

interface WeatherForecastApiResult {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: number;
	daily: {
		/** Unix UTC timestamp */
		dt: number;
		sunrise: number;
		sunset: number;
		moonrise: number;
		moonset: number;
		moon_phase: number;
		summary: string;
		temp: {
			day: number;
			min: number;
			max: number;
			night: number;
			eve: number;
			morn: number;
		};
		feels_like: {
			day: number;
			night: number;
			eve: number;
			morn: number;
		};
		pressure: number;
		humidity: number;
		dew_point: number;
		wind_speed: number;
		wind_deg: number;
		wind_gust?: number;
		clouds: number;
		uvi: number;
		/** precipitation probability 0-1 */
		pop: number;
		/** volume, mm */
		rain?: number;
		/** volume, mm */
		snow?: number;
		weather: {
			id: WeatherCondition;
			main: string;
			description: string;
			icon: string;
		}[];
	}[];
	alerts: {
		sender_name: string;
		event: string;
		start: number;
		end: number;
		description: string;
		tags: string[];
	}[];
}

export class Weather {
	constructor(private key: string) {}

	getForecast = async (
		input: WeatherForecastInput,
	): Promise<WeatherForecast> => {
		// validate provided dates - forecast can only
		// see 8 days ahead
		const now = formatDate(new Date());
		if (compare(input.endDate, input.startDate) < 0) {
			throw new BiscuitsError(
				BiscuitsError.Code.BadRequest,
				'End date must be after start date',
			);
		}
		// end is in the past
		if (compare(input.endDate, now) < 0) {
			return {
				days: [],
			};
		}
		// start is in the past
		if (compare(input.startDate, now) < 0) {
			input.startDate = now;
		}
		const range = getDateRange(input.startDate, input.endDate);
		const forecast: WeatherForecastDay[] = [];
		let error: string | undefined = undefined;

		// only request main forecast API if some of the requested
		// days are within the 8-day range
		let data: WeatherForecastApiResult | undefined = undefined;
		const maxForecastDate = formatDate(
			new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
		);
		// start date is within forecast range
		if (compare(input.startDate, maxForecastDate) < 0) {
			const params = new URLSearchParams();
			params.set('lat', input.latitude.toString());
			params.set('lon', input.longitude.toString());
			params.set('appid', this.key);
			params.set('exclude', 'current,minutely,hourly');
			params.set(
				'units',
				input.temperatureUnits === TemperatureUnit.Celsius ? 'metric'
				: input.temperatureUnits === TemperatureUnit.Kelvin ? 'standard'
				: 'imperial',
			);

			const response = await fetch(
				`https://api.openweathermap.org/data/3.0/onecall?${params.toString()}`,
			);
			if (!response.ok) {
				console.error(
					'Failed to fetch weather forecast',
					response.statusText,
					await response.text().catch(() => ''),
				);
				throw new BiscuitsError(
					BiscuitsError.Code.Unexpected,
					'Failed to fetch weather forecast',
				);
			}
			data = await response.json();
		}
		// match up the forecast days with the requested days
		for (const day of range) {
			const forecastDay = data?.daily.find(
				(d) =>
					formatDate(new Date((d.dt + (data?.timezone_offset ?? 0)) * 1000)) ===
					day,
			);
			if (forecastDay) {
				forecast.push({
					date: day,
					high: forecastDay.temp.max,
					low: forecastDay.temp.min,
					precipitationMM: forecastDay.rain ?? 0,
					temperatureUnit: input.temperatureUnits,
				});
			} else {
				error = 'Dates more than 1 week in the future may be inaccurate';
				// if the forecast API didn't return a forecast for the day,
				// we need to estimate the weather
				const estimated = await this.getEstimatedWeather({
					date: day,
					latitude: input.latitude,
					longitude: input.longitude,
					temperatureUnits: input.temperatureUnits,
				});
				forecast.push(estimated);
			}
		}

		return {
			days: forecast,
			error,
		};
	};

	getEstimatedWeather = async (
		input: EstimatedWeatherInput,
	): Promise<WeatherForecastDay> => {
		const params = new URLSearchParams();
		params.set('lat', input.latitude.toString());
		params.set('lon', input.longitude.toString());
		params.set('appid', this.key);
		// date must be formatted YYYY-MM-DD, ignoring tz
		params.set('date', input.date);
		params.set(
			'units',
			input.temperatureUnits === TemperatureUnit.Celsius ? 'metric'
			: input.temperatureUnits === TemperatureUnit.Kelvin ? 'standard'
			: 'imperial',
		);

		const response = await fetch(
			`https://api.openweathermap.org/data/3.0/onecall/day_summary?${params.toString()}`,
		);
		if (!response.ok) {
			console.error(
				'Failed to fetch weather forecast',
				response.statusText,
				await response.text().catch(() => ''),
			);
			throw new BiscuitsError(
				BiscuitsError.Code.Unexpected,
				'Failed to fetch weather forecast',
			);
		}

		const data: WeatherAggregateApiResult = await response.json();
		return {
			date: data.date,
			high: data.temperature.max,
			low: data.temperature.min,
			precipitationMM: data.precipitation.total,
			temperatureUnit: input.temperatureUnits,
		};
	};

	/**
	 * Get the geographic location of a place
	 * @param location The name of the city, state, and country; or a zip code
	 */
	getGeographicLocation = async (
		location: string,
	): Promise<GeographicResult[]> => {
		const params = new URLSearchParams();
		if (ZIP_CODE_REGEX.test(location)) {
			params.set('zip', location);
		} else {
			params.set('q', location);
		}
		params.set('limit', '10');
		params.set('appid', this.key);
		const response = await fetch(
			`http://api.openweathermap.org/geo/1.0/direct?${params.toString()}`,
		);
		if (!response.ok) {
			console.error(
				'Failed to fetch geographic location',
				response.statusText,
				await response.text().catch(() => ''),
			);
			return [];
		}
		const data: GeographicApiResult[] = await response.json();
		return data.map((r) => ({
			latitude: r.lat,
			longitude: r.lon,
			name: r.name,
			country: r.country,
			state: r.state,
		}));
	};
}

export function getDateRange(from: string, to: string): string[] {
	const days = Math.ceil(
		(new Date(to).getTime() + 24 * 60 * 60 * 100 - new Date(from).getTime()) /
			(24 * 60 * 60 * 1000),
	);
	// convert to UTC just in case system time isn't.
	const fromNormalized = new Date(from);
	fromNormalized.setTime(
		fromNormalized.getTime() + fromNormalized.getTimezoneOffset() * 60 * 1000,
	);
	const range: string[] = [];
	for (let i = 0; i < days; i++) {
		range.push(
			formatDate(new Date(fromNormalized.getTime() + i * 24 * 60 * 60 * 1000)),
		);
	}
	return range;
}

interface WeatherAggregateApiResult {
	lat: number;
	lon: number;
	tz: string;
	date: string;
	units: 'imperial' | 'metric' | 'standard';
	cloud_cover: {
		afternoon: number;
	};
	humidity: {
		afternoon: number;
	};
	pressure: {
		afternoon: number;
	};
	precipitation: {
		total: number;
	};
	temperature: {
		min: number;
		max: number;
		afternoon: number;
		night: number;
		evening: number;
		morning: number;
	};
	wind: {
		max: {
			speed: number;
			direction: number;
		};
	};
}

export interface EstimatedWeatherInput {
	date: string;
	latitude: number;
	longitude: number;
	temperatureUnits: TemperatureUnit;
}

function formatDate(date: Date) {
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

interface GeographicApiResult {
	name: string;
	local_names?: {
		[languageCode: string]: string;
	};
	lat: number;
	lon: number;
	country: string;
	state?: string;
}

export interface GeographicResult {
	name: string;
	latitude: number;
	longitude: number;
	country: string;
	state?: string;
}

const ZIP_CODE_REGEX = /^\d{5}(?:-\d{4})?$/;
