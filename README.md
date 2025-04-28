# Next Route Schemas

A package for integrating schemas with Next.js App Router. This package provides a clean, type-safe way to add structured data to your pages for improved SEO and data validation.

## Features

- Schema definition system with TypeScript support
- Seamless integration with Next.js App Router
- Support for both static and dynamic route schemas
- Schema validation and transformation utilities
- Metadata generation for SEO optimization
- Simple API for adding JSON-LD structured data
- Helper functions for common schema types (Article, Product, FAQ, etc.)

## Installation

```bash
npm install next-route-schemas
# or
yarn add next-route-schemas
# or
pnpm add next-route-schemas
```

## Basic Usage

### 1. Define your schema

```tsx
// schemas/productSchema.ts
import { createSchema } from 'next-route-schemas';
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  image: z.string().url(),
});

export const productRouteSchema = createSchema(productSchema)
  .withJsonLd((data) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency,
    },
    image: data.image,
  }))
  .withMetadata((data) => ({
    title: data.name,
    description: data.description,
    openGraph: {
      title: data.name,
      description: data.description,
      images: [data.image],
    },
  }))
  .build();
```

### 2. Use in a Static Page

```tsx
// app/products/[id]/page.tsx
import { Metadata } from 'next';
import { Schema, generateMetadata } from 'next-route-schemas';
import { productRouteSchema } from '@/schemas/productSchema';

// Mock data
const getProduct = (id: string) => {
  return {
    name: 'Example Product',
    description: 'This is an example product',
    price: 99.99,
    currency: 'USD',
    image: 'https://example.com/product.jpg',
  };
};

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getProduct(params.id);
  return generateMetadata(productRouteSchema, product);
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  const jsonLd = productRouteSchema.toJsonLd(product);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price} {product.currency}</p>
      <img src={product.image} alt={product.name} />
      
      {/* Add the schema to the page */}
      <Schema id="product" schema={jsonLd} />
    </div>
  );
}
```

### 3. Use in a Dynamic Client Component

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Schema, useSchema } from 'next-route-schemas';
import { productRouteSchema } from '@/schemas/productSchema';

export default function DynamicProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null);
  const { validate, getJsonLd, error } = useSchema('product', productRouteSchema);
  
  useEffect(() => {
    // Fetch product data
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [params.id]);
  
  if (!product) return <div>Loading...</div>;
  
  // Validate the data
  if (!validate(product)) {
    console.error('Invalid product data', error);
    return <div>Error: Invalid product data</div>;
  }
  
  // Get JSON-LD
  const jsonLd = getJsonLd(product);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price} {product.currency}</p>
      <img src={product.image} alt={product.name} />
      
      {/* Add the schema to the page */}
      <Schema id="product" schema={jsonLd} />
    </div>
  );
}
```

## Using Template Schemas

The package includes several pre-defined schema templates for common use cases:

```tsx
import { createArticleSchema, createProductSchema, createFaqSchema } from 'next-route-schemas';

// Use a pre-defined article schema
const articleData = {
  headline: 'Example Article',
  description: 'This is an example article',
  datePublished: new Date().toISOString(),
  author: {
    name: 'John Doe',
  },
};

const jsonLd = createArticleSchema.toJsonLd(articleData);
```

## License

MIT