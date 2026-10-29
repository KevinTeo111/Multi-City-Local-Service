// Working name from the client's mockups ("nearby", marked WORKING NAME).
// Taglines and descriptions live in the dictionaries (src/i18n).
export const site = {
  name: "nearby",
  url: "https://nearby.example.com",
};

/** Serializes structured data for a <script type="application/ld+json"> tag. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
