import { useTemperatureUnit } from './useTemperatureUnit.js';

export function TemperatureUnit() {
  const { unit } = useTemperatureUnit();
  return <span>{unit === 'fahrenheit' ? '°F' : '°C'}</span>;
}
