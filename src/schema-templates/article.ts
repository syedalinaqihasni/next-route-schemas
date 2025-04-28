import { Article, WithContext } from 'schema-dts';
import { z } from 'zod';
import { createSchema } from '../SchemaBuilder';
import { Metadata } from 'next';

export const articleSchema = z.object({
  headline: z.string(),
  description: z.string(),
  image: z.string().url().optional(),
  datePublished: z.string().or(z.date()),
  dateModified: z.string().or(z.date()).optional(),
  author: z.object({
    name: z.string(),
    url: z.string().url().optional(),
  }),
  publisher: z.object({
    name: z.string(),
    logo: z.string().url().optional(),
  }).optional(),
  url: z.string().url().optional(),
});

export type ArticleSchemaType = z.infer<typeof articleSchema>;

export const createArticleSchema = createSchema(articleSchema)
  .withJsonLd((data): WithContext<Article> => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      ...(data.image && { image: data.image }),
      datePublished: data.datePublished instanceof Date 
        ? data.datePublished.toISOString() 
        : data.datePublished,
      ...(data.dateModified && { 
        dateModified: data.dateModified instanceof Date 
          ? data.dateModified.toISOString() 
          : data.dateModified 
      }),
      author: {
        '@type': 'Person',
        name: data.author.name,
        ...(data.author.url && { url: data.author.url }),
      },
      ...(data.publisher && {
        publisher: {
          '@type': 'Organization',
          name: data.publisher.name,
          ...(data.publisher.logo && { 
            logo: {
              '@type': 'ImageObject',
              url: data.publisher.logo
            } 
          }),
        },
      }),
      ...(data.url && { url: data.url }),
    };
  })
  .withMetadata((data): Partial<Metadata> => {
    return {
      title: data.headline,
      description: data.description,
      openGraph: {
        title: data.headline,
        description: data.description,
        type: 'article',
        ...(data.image && { images: [data.image] }),
        ...(data.datePublished && { 
          publishedTime: data.datePublished instanceof Date 
            ? data.datePublished.toISOString() 
            : data.datePublished 
        }),
        ...(data.dateModified && { 
          modifiedTime: data.dateModified instanceof Date 
            ? data.dateModified.toISOString() 
            : data.dateModified 
        }),
        ...(data.url && { url: data.url }),
      },
      twitter: {
        card: 'summary_large_image',
        title: data.headline,
        description: data.description,
        ...(data.image && { images: [data.image] }),
      },
    };
  })
  .build();