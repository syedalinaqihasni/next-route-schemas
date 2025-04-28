import { Person, WithContext } from 'schema-dts';
import { z } from 'zod';
import { createSchema } from '../SchemaBuilder';
import { Metadata } from 'next';

export const personSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  jobTitle: z.string().optional(),
  email: z.string().email().optional(),
  telephone: z.string().optional(),
  sameAs: z.array(z.string().url()).optional(),
  url: z.string().url().optional(),
  address: z.object({
    streetAddress: z.string().optional(),
    addressLocality: z.string().optional(),
    addressRegion: z.string().optional(),
    postalCode: z.string().optional(),
    addressCountry: z.string().optional(),
  }).optional(),
});

export type PersonSchemaType = z.infer<typeof personSchema>;

export const createPersonSchema = createSchema(personSchema)
  .withJsonLd((data): WithContext<Person> => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name,
      ...(data.description && { description: data.description }),
      ...(data.image && { image: data.image }),
      ...(data.jobTitle && { jobTitle: data.jobTitle }),
      ...(data.email && { email: data.email }),
      ...(data.telephone && { telephone: data.telephone }),
      ...(data.sameAs && { sameAs: data.sameAs }),
      ...(data.url && { url: data.url }),
      ...(data.address && {
        address: {
          '@type': 'PostalAddress',
          ...data.address,
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
        type: 'profile',
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