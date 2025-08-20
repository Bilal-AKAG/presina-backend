export type SlideType =
  | "title"
  | "bullet"
  | "image-text"
  | "quote"
  | "chart"
  | "title-content"
  | "two-column";

export interface SlideData {
  type: SlideType;

  // title
  title?: string;
  subtitle?: string;

  // bullet
  bullets?: string[];

  // title-content
  content?: string;

  // two-column
  leftTitle?: string;
  leftContent?: string;
  rightTitle?: string;
  rightContent?: string;

  // image-text
  image?: string;
  heading?: string;
  text?: string;

  // quote
  quote?: string;
  author?: string;

  // chart
  data?: { name: string; value: number }[];
}
