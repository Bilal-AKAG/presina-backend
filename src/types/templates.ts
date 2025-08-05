export interface TemplateInput {
  name: string;
  layout: "title-content" | "image-left-text" | "two-column" | "custom";
  placeholders: string[];
}
