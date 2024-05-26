import { UsfmParagraph } from '@/components/usfm/UsfmParagraph.jsx';
import {
  getParagraphFormatting,
  isChapter,
  isParagraph,
} from '@/components/usfm/recognizers.js';
import { UsfmParagraphData } from '@/components/usfm/types.js';

export interface UsfmRendererProps {
  root: string;
}

export function UsfmRenderer({ root }: UsfmRendererProps) {
  const bookName = root.match(/^\\h (.*)$/m)?.[1];
  const remaining = root.slice(root.indexOf('\\c 1'));
  const lines = remaining.split('\n');
  const paragraphs = useParagraphs(lines);

  return (
    <div className="usfm-renderer">
      <h1>{bookName}</h1>
      {paragraphs.map((paragraph, index) => (
        <UsfmParagraph key={index} content={paragraph} />
      ))}
    </div>
  );
}

function useParagraphs(lines: string[]) {
  let chapter = 1;
  let chapterChanged = false;
  const paragraphs: UsfmParagraphData[] = [];
  let currentParagraph: UsfmParagraphData | null = null;
  while (lines.length > 0) {
    const line = lines.shift()!;
    if (isParagraph(line)) {
      if (currentParagraph && currentParagraph.lines.length > 0) {
        paragraphs.push(currentParagraph);
      }
      currentParagraph = {
        lines: [],
        chapter,
        chapterStart: chapterChanged,
        formatting: getParagraphFormatting(line),
      };
      chapterChanged = false;
    } else if (isChapter(line)) {
      const chapterMatch = line.match(/^\\c (\d+)/)?.[1];
      if (chapterMatch) {
        chapter = parseInt(chapterMatch);
        chapterChanged = true;
      }
    } else {
      if (!currentParagraph) {
        throw new Error('No current paragraph!');
      }
      currentParagraph.lines.push(line);
    }
  }
  if (currentParagraph?.lines?.length) {
    paragraphs.push(currentParagraph);
  }
  return paragraphs;
}
