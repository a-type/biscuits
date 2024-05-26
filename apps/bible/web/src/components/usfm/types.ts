export interface UsfmParagraphData {
  chapter: number;
  chapterStart: boolean;
  lines: string[];
  formatting: UsfmParagraphFormatting;
}

export interface UsfmParagraphFormatting {
  continuation?: boolean;
  indentation?: number;
  opening?: boolean;
  alignment?: 'left' | 'center' | 'right';
  closure?: boolean;
  embedded?: boolean;
}
