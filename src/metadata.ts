import { Metadata } from 'next';
import { RouteSchema, SchemaData } from './types';
import { z } from 'zod';

/**
 * Generate metadata for a route from schema data
 * @param schema The route schema
 * @param data The schema data
 */
export function generateMetadata<T extends z.ZodType>(
  schema: RouteSchema<T>,
  data: z.infer<T>
): Partial<Metadata> {
  if (schema.toMetadata) {
    return schema.toMetadata(data);
  }
  return {};
}

/**
 * Combine multiple metadata objects
 * @param metadataList List of metadata objects to combine
 */
export function combineMetadata(metadataList: Partial<Metadata>[]): Metadata {
  return metadataList.reduce((acc, metadata) => {
    return {
      ...acc,
      ...metadata,
      // Special handling for openGraph and other nested objects
      openGraph: {
        ...acc.openGraph,
        ...metadata.openGraph,
      },
      twitter: {
        ...acc.twitter,
        ...metadata.twitter,
      },
      // Other nested objects can be added here
    };
  }, {} as Metadata);
}