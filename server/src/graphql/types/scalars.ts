import { builder } from '../builder.js';
import { DateResolver, JSONResolver } from 'graphql-scalars';

builder.addScalarType('DateTime', DateResolver);
builder.addScalarType('JSON', JSONResolver);
