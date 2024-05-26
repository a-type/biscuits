import { ReactNode } from 'react';
import classNames from 'classnames';
import { UsfmParagraphData } from '@/components/usfm/types.js';
import { isVerse } from '@/components/usfm/recognizers.js';
import { UsfmVerse } from '@/components/usfm/UsfmVerse.jsx';

export interface UsfmParagraphProps {
  content: UsfmParagraphData;
}

export function UsfmParagraph({ content }: UsfmParagraphProps) {
  const { continuation, indentation, opening, alignment, closure, embedded } =
    content.formatting;
  const lines = [...content.lines];
  const verses: ReactNode[] = [];

  while (lines.length > 0) {
    const line = lines.shift()!;
    if (isVerse(line)) {
      verses.push(<UsfmVerse line={line} key={verses.length} />);
    }
  }

  return (
    <p
      className={classNames({
        'ml-1': indentation === 1,
        'ml-2': indentation === 2,
        'ml-3': indentation === 3,
        'ml-4': indentation === 4,
        'ml-5': indentation === 5,
        'ml-6': indentation === 6,
        'ml-7': indentation === 7,
        'ml-8': indentation === 8,
        'indent-md': !continuation && !content.chapterStart,
      })}
    >
      {content.chapterStart && (
        <span className="float-left text-xl font-bold mr-3">
          {content.chapter}
        </span>
      )}
      {verses}
    </p>
  );
}
