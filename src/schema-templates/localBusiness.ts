import { LocalBusiness, WithContext } from 'schema-dts';
import { z } from 'zod';
import { createSchema } from '../SchemaBuilder';
import { Metadata } from 'next';

export const localBusinessSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  url: z.string().url().optional(),
  telephone: z.string().optional(),
  email: z.string().email().optional(),
  priceRange: z.string().optional(),
  openingHours: z.array(z.object({
    dayOfWeek: z.string(),
    opens: z.string(),
    closes: z.string(),
  })).optional(),
  address: z.object({
    streetAddress: z.string(),
    addressLocality: z.string(),
    addressRegion: z.string().optional(),
    postalCode: z.string().optional(),
    addressCountry: z.string().optional(),
  }),
  geo: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});

export type LocalBusinessSchemaType = z.infer<typeof localBusinessSchema>;

export const createLocalBusinessSchema = createSchema(localBusinessSchema)
  .withJsonLd((data): WithContext<LocalBusiness> => {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: data.name,
      ...(data.description && { description: data.description }),
      ...(data.image && { image: data.image }),
      ...(data.url && { url: data.url }),
      ...(data.telephone && { telephone: data.telephone }),
      ...(data.email && { email: data.email }),
      ...(data.priceRange && { priceRange: data.priceRange }),
      ...(data.openingHours && {
        openingHoursSpecification: data.openingHours.map(hours => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: hours.dayOfWeek,
          opens: hours.opens,
          closes: hours.closes,
        })),
      }),
      address: {
        '@type': 'PostalAddress',
        ...data.address,
      },
      ...(data.geo && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: data.geo.latitude,
          longitude: data.geo.longitude,
        },
      }),
    };
  })
  .withMetadata((data): Partial<Metadata> => {
    return {
      title: data.name,
      ...(data.description && { description: data.description }),
      openGraph: {
        title: data.name,
        ...(data.description && { description: data.description }),
        type: 'business.business',
        ...(data.image && { images: [data.image] }),
        ...(data.url && { url: data.url }),
      },
      twitter: {
        card: 'summary',
        title: data.name,
        ...(data.description && { description: data.description }),
        ...(data.image && { images: [data.image] }),
      },
    };
  })
  .build();