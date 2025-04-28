import React from 'react';
import { Thing, WithContext } from 'schema-dts';
import { SCHEMA_DATA_ATTRIBUTE, SCHEMA_ID_ATTRIBUTE } from './constants';

interface SchemaProps {
  id: string;
  schema: WithContext<Thing> | WithContext<Thing>[];
}

/**
 * Component for rendering JSON-LD schema in the page
 */
export function Schema({ id, schema }: SchemaProps): React.ReactElement {
  const schemaString = React.useMemo(() => {
    return JSON.stringify(schema);
  }, [schema]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
      {...{ [SCHEMA_DATA_ATTRIBUTE]: true }}
      {...{ [SCHEMA_ID_ATTRIBUTE]: id }}
    />
  );
}