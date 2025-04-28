import { FAQPage, WithContext } from 'schema-dts';
import { z } from 'zod';
import { createSchema } from '../SchemaBuilder';
import { Metadata } from 'next';

export const faqSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  questions: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  url: z.string().url().optional(),
});

export type FaqSchemaType = z.infer<typeof faqSchema>;

export const createFaqSchema = createSchema(faqSchema)
  .withJsonLd((data): WithContext<FAQPage> => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
        },
      })),
    };
  })
  .withMetadata((data): Partial<Metadata> => {
    return {
      title: data.title,
      ...(data.description && { description: data.description }),
      openGraph: {
        title: data.title,
        ...(data.description && { description: data.description }),
        type: 'website',
        ...(data.url && { url: data.url }),
      },
      twitter: {
        card: 'summary',
        title: data.title,
        ...(data.description && { description: data.description }),
      },
    };
  })
  .build();