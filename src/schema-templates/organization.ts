import { Organization, WithContext } from 'schema-dts';
import { z } from 'zod';
import { createSchema } from '../SchemaBuilder';
import { Metadata } from 'next';

export const organizationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  url: z.string().url().optional(),
  sameAs: z.array(z.string().url()).optional(),
  email: z.string().email().optional(),
  telephone: z.string().optional(),
  address: z.object({
    streetAddress: z.string().optional(),
    addressLocality: z.string().optional(),
    addressRegion: z.string().optional(),
    postalCode: z.string().optional(),
    addressCountry: z.string().optional(),
  }).optional(),
});

export type OrganizationSchemaType = z.infer<typeof organizationSchema>;

export const createOrganizationSchema = createSchema(organizationSchema)
  .withJsonLd((data): WithContext<Organization> => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      ...(data.description && { description: data.description }),
      ...(data.logo && { 
        logo: data.logo,
        image: data.logo
      }),
      ...(data.url && { url: data.url }),
      ...(data.sameAs && { sameAs: data.sameAs }),
      ...(data.email && { email: data.email }),
      ...(data.telephone && { telephone: data.telephone }),
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
        type: 'website',
        ...(data.logo && { images: [data.logo] }),
        ...(data.url && { url: data.url }),
      },
      twitter: {
        card: 'summary',
        title: data.name,
        ...(data.description && { description: data.description }),
        ...(data.logo && { images: [data.logo] }),
      },
    };
  })
  .build();