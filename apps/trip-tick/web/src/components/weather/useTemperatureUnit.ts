import { useUserPreference } from '@biscuits/client';
import {
  celsiusToKelvin,
  fahrenheitToKelvin,
  kelvinToCelsius,
  kelvinToFahrenheit,
} from './utils.js';

export function useTemperatureUnit() {
  const [unit, setUnit] = useUserPreference('temperatureUnit', 'fahrenheit');

  return {
    unit,
    setUnit,
    toDisplay: (kelvin: number) => {
      if (unit === 'celsius') return Math.round(kelvinToCelsius(kelvin));
      return Math.round(kelvinToFahrenheit(kelvin));
    },
    fromDisplay: (value: number) => {
      if (unit === 'celsius') return celsiusToKelvin(value);
      return fahrenheitToKelvin(value);
    },
  };
}
