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
    if (value instanceof Date) {
      return value.toDateString();
    }
    throw new Error('Date must be a valid date object');
  },
  parseValue: (value) => {
    if (typeof value === 'string') {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    throw new Error('Date must be a valid date string');
  },
});
builder.addScalarType('JSON', JSONResolver);
