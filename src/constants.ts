import { SchemaOptions } from './types';

/**
 * Default schema options
 */
export const DEFAULT_SCHEMA_OPTIONS: Required<SchemaOptions> = {
  validate: true,
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Schema data attribute for HTML
 */
export const SCHEMA_DATA_ATTRIBUTE = 'data-nextjs-schema';

/**
 * Schema ID attribute for HTML
 */
export const SCHEMA_ID_ATTRIBUTE = 'data-schema-id';