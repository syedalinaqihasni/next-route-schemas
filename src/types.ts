import { Metadata } from 'next';
import { Thing, WithContext } from 'schema-dts';
import { z } from 'zod';

/**
 * Represents a schema for a Next.js route
 */
export interface RouteSchema<T extends z.ZodType = z.ZodType> {
  /**
   * The zod schema for validating the route data
   */
  schema: T;
  
  /**
   * Function to transform validated data into JSON-LD format
   */
  toJsonLd: (data: z.infer<T>) => WithContext<Thing> | WithContext<Thing>[];
  
  /**
   * Function to generate metadata from the schema data
   */
  toMetadata?: (data: z.infer<T>) => Partial<Metadata>;
}

/**
 * Configuration options for schema usage
 */
export interface SchemaOptions {
  /**
   * Whether to validate the data against the schema
   * @default true
   */
  validate?: boolean;

  /**
   * Whether to include debug information in development
   * @default process.env.NODE_ENV === 'development'
   */
  debug?: boolean;
}

/**
 * Schema provider context value
 */
export interface SchemaContextValue {
  schemas: Map<string, RouteSchema>;
  options: Required<SchemaOptions>;
}

/**
 * Schema data with metadata
 */
export interface SchemaData<T = unknown> {
  /**
   * The route path
   */
  path: string;
  
  /**
   * The schema identifier
   */
  schemaId: string;
  
  /**
   * The validated data
   */
  data: T;
}

/**
 * Schema registry entry
 */
export interface SchemaRegistryEntry {
  path: string;
  schemaId: string;
  schema: RouteSchema;
}