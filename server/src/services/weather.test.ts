import { describe, it, expect } from 'vitest';
import { getDateRange } from './weather.js';

describe('weather service', () => {
  describe('date range', () => {
    it('creates an inclusive range of date strings', () => {
      expect(getDateRange('2021-01-01', '2021-01-03')).toEqual([
        '2021-01-01',
        '2021-01-02',
        '2021-01-03',
      ]);
    });
  });
});
