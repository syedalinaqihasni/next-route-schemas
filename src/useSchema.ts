'use client';

import { useCallback, useState } from 'react';
import { DEFAULT_SCHEMA_OPTIONS } from './constants';
import { RouteSchema, SchemaData, SchemaOptions } from './types';
import { z } from 'zod';

/**
 * Hook for using schemas in client components
 */
export function useSchema<T extends z.ZodType>(
  schemaId: string,
  schema: RouteSchema<T>,
  options?: SchemaOptions
): {
  validate: (data: unknown) => data is z.infer<T>;
  createSchemaData: (path: string, data: z.infer<T>) => SchemaData<z.infer<T>>;
  getJsonLd: (data: z.infer<T>) => ReturnType<RouteSchema<T>['toJsonLd']>;
  getMetadata: (data: z.infer<T>) => Partial<ReturnType<NonNullable<RouteSchema<T>['toMetadata']>>>;
  error: z.ZodError | null;
} {
  const [error, setError] = useState<z.ZodError | null>(null);
  const mergedOptions = { ...DEFAULT_SCHEMA_OPTIONS, ...options };

  const validate = useCallback(
    (data: unknown): data is z.infer<T> => {
      if (!mergedOptions.validate) {
        return true as any;
      }

      try {
        schema.schema.parse(data);
        setError(null);
        return true;
      } catch (e) {
        if (e instanceof z.ZodError) {
          setError(e);
        }
        return false;
      }
    },
    [schema, mergedOptions.validate]
  );

  const createSchemaData = useCallback(
    (path: string, data: z.infer<T>): SchemaData<z.infer<T>> => {
      return {
        path,
        schemaId,
        data,
      };
    },
    [schemaId]
  );

  const getJsonLd = useCallback(
    (data: z.infer<T>) => {
      return schema.toJsonLd(data);
    },
    [schema]
  );

  const getMetadata = useCallback(
    (data: z.infer<T>) => {
      if (schema.toMetadata) {
        return schema.toMetadata(data);
      }
      return {};
    },
    [schema]
  );

  return {
    validate,
    createSchemaData,
    getJsonLd,
    getMetadata,
    error,
  };
}