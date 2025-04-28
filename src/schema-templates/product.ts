import { Product, WithContext } from 'schema-dts';
import { z } from 'zod';
import { createSchema } from '../SchemaBuilder';
import { Metadata } from 'next';

export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().url().or(z.array(z.string().url())).optional(),
  sku: z.string().optional(),
  mpn: z.string().optional(),
  brand: z.object({
    name: z.string(),
  }).optional(),
  offers: z.object({
    price: z.number(),
    priceCurrency: z.string(),
    availability: z.enum([
      'InStock', 
      'OutOfStock', 
      'PreOrder', 
      'BackOrder'
    ]).optional(),
    url: z.string().url().optional(),
    validFrom: z.string().or(z.date()).optional(),
    priceValidUntil: z.string().or(z.date()).optional(),
  }),
  aggregateRating: z.object({
    ratingValue: z.number(),
    reviewCount: z.number(),
  }).optional(),
  url: z.string().url().optional(),
});

export type ProductSchemaType = z.infer<typeof productSchema>;

export const createProductSchema = createSchema(productSchema)
  .withJsonLd((data): WithContext<Product> => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      ...(data.image && { 
        image: Array.isArray(data.image) ? data.image : [data.image] 
      }),
      ...(data.sku && { sku: data.sku }),
      ...(data.mpn && { mpn: data.mpn }),
      ...(data.brand && { 
        brand: {
          '@type': 'Brand',
          name: data.brand.name,
        } 
      }),
      offers: {
        '@type': 'Offer',
        price: data.offers.price,
        priceCurrency: data.offers.priceCurrency,
        ...(data.offers.availability && { 
          availability: `https://schema.org/${data.offers.availability}` 
        }),
        ...(data.offers.url && { url: data.offers.url }),
        ...(data.offers.validFrom && { 
          validFrom: data.offers.validFrom instanceof Date 
            ? data.offers.validFrom.toISOString() 
            : data.offers.validFrom 
        }),
        ...(data.offers.priceValidUntil && { 
          priceValidUntil: data.offers.priceValidUntil instanceof Date 
            ? data.offers.priceValidUntil.toISOString() 
            : data.offers.priceValidUntil 
        }),
      },
      ...(data.aggregateRating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: data.aggregateRating.ratingValue,
          reviewCount: data.aggregateRating.reviewCount,
        },
      }),
      ...(data.url && { url: data.url }),
    };
  })
  .withMetadata((data): Partial<Metadata> => {
    return {
      title: data.name,
      description: data.description,
      openGraph: {
        title: data.name,
        description: data.description,
        type: 'product',
        ...(data.image && { 
          images: Array.isArray(data.image) ? data.image : [data.image] 
        }),
        ...(data.url && { url: data.url }),
      },
      twitter: {
        card: 'summary_large_image',
        title: data.name,
        description: data.description,
        ...(data.image && { 
          images: Array.isArray(data.image) 
            ? [data.image[0]] 
            : [data.image] 
        }),
      },
    };
  })
  .build();