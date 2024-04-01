import { BiscuitsError } from '@biscuits/error';
import { OPENWEATHER_API_KEY } from '../config/secrets.js';

export enum TemperatureUnit {
  Celsius = 'C',
  Fahrenheit = 'F',
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
  startDate: Date;
  endDate: Date;
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

export async function getForecast(
  input: WeatherForecastInput,
): Promise<WeatherForecast> {
  // validate provided dates - forecast can only
  // see 8 days ahead
  const now = new Date();
  if (input.endDate < input.startDate) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'End date must be after start date',
    );
  }
  if (input.endDate < now) {
    return {
      days: [],
    };
  }
  if (input.startDate < now) {
    input.startDate = now;
  }

  const forecast: WeatherForecastDay[] = [];

  // only request main forecast API if some of the requested
  // days are within the 8-day range
  if (input.endDate > new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000)) {
    const params = new URLSearchParams();
    params.set('lat', input.latitude.toString());
    params.set('lon', input.longitude.toString());
    params.set('appid', OPENWEATHER_API_KEY);
    params.set('exclude', 'current,minutely,hourly');
    params.set(
      'units',
      input.temperatureUnits === TemperatureUnit.Celsius
        ? 'metric'
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
    const data: WeatherForecastApiResult = await response.json();
    // match up the forecast days with the requested days
    for (const day of data.daily) {
      const dayDate = new Date(day.dt * 1000);
      if (dayDate < input.startDate || dayDate > input.endDate) {
        continue;
      }
      forecast.push({
        date: dayDate.toISOString(),
        high: day.temp.max,
        low: day.temp.min,
        precipitationMM: day.rain ?? 0,
        temperatureUnit: input.temperatureUnits,
      });
    }
  }

  // was the end of the forecast range > 1 day behind the end of the
  // user-supplied range? then we need to fetch data from the aggregate
  // api for those days
  const lastDayOfForecast = forecast[forecast.length - 1]?.date;
  const mustEstimateFurther =
    !lastDayOfForecast || new Date(lastDayOfForecast) < input.endDate;
  if (mustEstimateFurther) {
    const remainingRange = getDateRange(
      new Date(lastDayOfForecast ?? input.startDate),
      input.endDate,
    );

    for (const date of remainingRange) {
      const estimated = await getEstimatedWeather({
        date: date,
        latitude: input.latitude,
        longitude: input.longitude,
        temperatureUnits: input.temperatureUnits,
      });
      forecast.push(estimated);
    }
  }

  return {
    days: forecast,
    error: mustEstimateFurther
      ? 'Dates more than 1 week in the future may be inaccurate'
      : undefined,
  };
}

function getDateRange(from: Date, to: Date) {
  const range: Date[] = [];
  const current = new Date(from);
  while (current <= to) {
    range.push(new Date(current));
    current.setDate(current.getDate() + 1);
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
  date: Date;
  latitude: number;
  longitude: number;
  temperatureUnits: TemperatureUnit;
}

export async function getEstimatedWeather(
  input: EstimatedWeatherInput,
): Promise<WeatherForecastDay> {
  const params = new URLSearchParams();
  params.set('lat', input.latitude.toString());
  params.set('lon', input.longitude.toString());
  params.set('appid', OPENWEATHER_API_KEY);
  // date must be formatted YYYY-MM-DD
  params.set('date', input.date.toISOString().split('T')[0]);
  params.set(
    'units',
    input.temperatureUnits === TemperatureUnit.Celsius ? 'metric' : 'imperial',
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

/**
 * Get the geographic location of a place
 * @param location The name of the city, state, and country; or a zip code
 */
export async function getGeographicLocation(
  location: string,
): Promise<GeographicResult[]> {
  const params = new URLSearchParams();
  if (ZIP_CODE_REGEX.test(location)) {
    params.set('zip', location);
  } else {
    params.set('q', location);
  }
  params.set('limit', '10');
  params.set('appid', OPENWEATHER_API_KEY);
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
}

const ZIP_CODE_REGEX = /^\d{5}(?:-\d{4})?$/;
