import { z } from 'zod';
import { Thing, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import { RouteSchema } from './types';

/**
 * Builder for creating route schemas
 */
export class SchemaBuilder<T extends z.ZodType> {
  private schema: T;
  private jsonLdTransformer?: (data: z.infer<T>) => WithContext<Thing> | WithContext<Thing>[];
  private metadataTransformer?: (data: z.infer<T>) => Partial<Metadata>;

  /**
   * Create a new schema builder
   * @param schema The zod schema for validating route data
   */
  constructor(schema: T) {
    this.schema = schema;
  }

  /**
   * Define how to transform validated data into JSON-LD
   * @param transformer Function to transform data to JSON-LD
   */
  withJsonLd(
    transformer: (data: z.infer<T>) => WithContext<Thing> | WithContext<Thing>[]
  ): SchemaBuilder<T> {
    this.jsonLdTransformer = transformer;
    return this;
  }

  /**
   * Define how to generate metadata from the schema data
   * @param transformer Function to transform data to metadata
   */
  withMetadata(
    transformer: (data: z.infer<T>) => Partial<Metadata>
  ): SchemaBuilder<T> {
    this.metadataTransformer = transformer;
    return this;
  }

  /**
   * Build the route schema
   */
  build(): RouteSchema<T> {
    if (!this.jsonLdTransformer) {
      throw new Error('JSON-LD transformer is required');
    }

    return {
      schema: this.schema,
      toJsonLd: this.jsonLdTransformer,
      toMetadata: this.metadataTransformer,
    };
  }
}

/**
 * Create a new schema builder
 * @param schema The zod schema for validating route data
 */
export function createSchema<T extends z.ZodType>(schema: T): SchemaBuilder<T> {
  return new SchemaBuilder(schema);
}