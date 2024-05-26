import { PARAGRAPH_MARKERS } from '@/components/usfm/constants.js';
import { UsfmParagraphFormatting } from '@/components/usfm/types.js';

export function isParagraph(line: string) {
  return PARAGRAPH_MARKERS.some((marker) => line.startsWith(marker));
}

export function isChapter(line: string) {
  return line.startsWith('\\c');
}

export function isVerse(line: string) {
  return line.startsWith('\\v');
}

export function getParagraphFormatting(line: string): UsfmParagraphFormatting {
  let indentation = 0;
  if (line.startsWith('\\pi') || line.startsWith('\\ph')) {
    // TODO: parse the number of spaces.
    indentation = 1;
  }

  return {
    continuation: line.startsWith('\\m'),
    indentation,
    opening: line.startsWith('\\po') || line.startsWith('\\pmo'),
    alignment: line.startsWith('\\pr')
      ? 'right'
      : line.startsWith('\\pc')
        ? 'center'
        : 'left',
    closure: line.startsWith('\\cls') || line.startsWith('\\pmc'),
    embedded: line.startsWith('\\pm'),
  };
}
