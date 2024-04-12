import { builder } from '../builder.js';
import { JSONResolver } from 'graphql-scalars';

builder.scalarType('DateTime', {
  serialize: (value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error('DateTime must be a valid date object');
  },
  parseValue: (value) => {
    if (typeof value === 'string') {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    throw new Error('DateTime must be a valid date string');
  },
});
builder.scalarType('Date', {
  serialize: (value) => {
    if (typeof value === 'string') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error('Date must be in the format YYYY-MM-DD');
      }
      return value;
    }
    throw new Error('Date must be a string');
  },
  parseValue: (value) => {
    if (typeof value === 'string') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error('Date must be in the format YYYY-MM-DD');
      }
      return value;
    }
    throw new Error('Date must be a valid date string');
  },
});
builder.addScalarType('JSON', JSONResolver);
