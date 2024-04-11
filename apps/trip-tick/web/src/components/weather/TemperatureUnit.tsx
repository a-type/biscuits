export function TemperatureUnit({ unit }: { unit: 'Fahrenheit' | 'Celsius' }) {
  return <span>{unit === 'Fahrenheit' ? '°F' : '°C'}</span>;
}
