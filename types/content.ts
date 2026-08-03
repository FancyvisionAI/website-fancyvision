export type HeroData = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
};

export type SectionData = Record<string, unknown>;

export type RichTextDoc = {
  type: "doc";
  content?: Array<Record<string, unknown>>;
};
