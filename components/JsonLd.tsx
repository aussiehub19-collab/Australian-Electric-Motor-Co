import React from 'react';

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export function JsonLd({ data }: JsonLdProps) {
  // Validate data is clean JSON before injecting
  let jsonString = '';
  try {
    jsonString = JSON.stringify(data);
  } catch (err) {
    console.error('Failed to stringify JSON-LD:', err);
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
