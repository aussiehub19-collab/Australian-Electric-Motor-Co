/**
 * Shared FAQPage JSON-LD builder — every page that renders a <FaqAccordion>
 * pairs it with this so the visible Q&A and the structured data can never
 * drift out of sync (one array feeds both).
 */

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Builds a schema.org FAQPage block from a list of Q&A pairs. Pass
 * `speakableIndexes` (0-based, into `items`) to also flag those answers'
 * question text for `speakable` — reserved for the single best answer(s) on
 * a page, not every entry, per the keyword-engine skill's AI-visibility rule.
 */
export function buildFaqSchema(items: FaqItem[], speakableIndexes: number[] = []) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  if (speakableIndexes.length > 0) {
    schema.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableIndexes.map((i) => `#faq-answer-${i}`),
    };
  }

  return schema;
}
