import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';
import { graphql, useCanSync, useSuspenseQuery } from '@biscuits/client';
import { Trip } from '@trip-tick.biscuits/verdant';
import { Suspense } from 'react';
import { Chip } from '@a-type/ui/components/chip';

export interface WeatherForecastProps {
  className?: string;
  trip: Trip;
}

const forecast = graphql(`
  query WeatherForecast($input: WeatherForecastInput!) {
    weatherForecast(input: $input) {
      error
      high
      low
      willRain
      temperatureUnit
    }
  }
`);

export function WeatherForecast({ className, trip }: WeatherForecastProps) {
  const { location, startsAt, endsAt } = hooks.useWatch(trip);
  hooks.useWatch(location);
  const subscribed = useCanSync();

  if (!location || !startsAt || !endsAt || !subscribed) {
    return null;
  }

  return (
    <div className={className}>
      <Suspense>
        <Forecast
          startsAt={startsAt}
          endsAt={endsAt}
          latitude={location.get('latitude')}
          longitude={location.get('longitude')}
        />
      </Suspense>
    </div>
  );
}

function Forecast({
  startsAt,
  endsAt,
  latitude,
  longitude,
}: {
  startsAt: number;
  endsAt: number;
  latitude: number;
  longitude: number;
}) {
  const { data } = useSuspenseQuery(forecast, {
    variables: {
      input: {
        startDate: new Date(startsAt).toISOString(),
        endDate: new Date(endsAt).toISOString(),
        latitude,
        longitude,
        temperatureUnits: 'Fahrenheit',
      },
    },
    fetchPolicy: 'cache-first',
  });

  return (
    <div className="flex flex-row gap-1 flex-wrap px-2">
      <Chip>
        <Icon name="arrowUp" className="text-attention-dark" />
        <span>
          {Math.round(data.weatherForecast.high)}
          <TempUnit unit={data.weatherForecast.temperatureUnit} />
        </span>
      </Chip>
      <Chip>
        <Icon name="arrowDown" className="text-primary-dark" />
        {Math.round(data.weatherForecast.low)}
        <TempUnit unit={data.weatherForecast.temperatureUnit} />
      </Chip>
      {data.weatherForecast.willRain && <Chip>Rain</Chip>}
    </div>
  );
}

function TempUnit({ unit }: { unit: 'Fahrenheit' | 'Celsius' }) {
  return <span>{unit === 'Fahrenheit' ? '°F' : '°C'}</span>;
}
