import { ReactNode } from 'react';
import { Tooltip } from '@a-type/ui/components/tooltip';
import { clsx } from '@a-type/ui';

export interface UsfmVerseProps {
  line: string;
}

export function UsfmVerse({ line }: UsfmVerseProps) {
  const withoutMarker = line.slice(3);
  // FIXME:
  let [verseNumber, ...rest] = withoutMarker.split(' ');
  let remaining = rest.join(' ');

  const words = useParsedWords(remaining);

  return (
    <span className="leading-loose" data-raw={line}>
      <span className="text-xs italic vertical-super">{verseNumber}</span>&nbsp;
      {words}
    </span>
  );
}

function useParsedWords(source: string) {
  let remaining = source;
  const words: ReactNode[] = [];
  while (remaining.length > 0) {
    // FIXME: check beginning for marker to make \f work too....
    const nextMarker = remaining.match(/\\(\+?\w+)/);
    if (nextMarker) {
      const nextMarkerPosition = nextMarker.index || 0;
      if (nextMarkerPosition > 0) {
        words.push(
          <span key={words.length}>
            {remaining.slice(0, nextMarkerPosition)}
          </span>,
        );
        remaining = remaining.slice(nextMarkerPosition);
      } else {
        let nextMarkerName = nextMarker[1];
        let nextMarkerNested = false;
        let searchForEndMarker = nextMarkerName;
        // '+' indicates a nested marker but doesn't otherwise
        // affect behavior.
        if (nextMarkerName.startsWith('+')) {
          nextMarkerName = nextMarkerName.slice(1);
          // since the search is regex we have to escape the +
          searchForEndMarker = '\\+' + nextMarkerName;
          nextMarkerNested = true;
        }
        const nextMarkerContent = remaining.match(
          new RegExp(
            `\\\\${searchForEndMarker}(.*?)\\\\${searchForEndMarker}\\\*`,
          ),
        );
        if (!nextMarkerContent) {
          throw new Error(
            'No end marker for ' +
              searchForEndMarker +
              ' while searching ' +
              remaining,
          );
        }
        const [whole, content] = nextMarkerContent;
        if (nextMarkerName.startsWith('f')) {
          // just "f" is a footnote
          // "f#" is a footnote with a number
          // "fe" is an endnote
          words.push(<UsfmFootnote key={words.length} content={content} />);
        } else if (nextMarkerName === 'w') {
          words.push(
            <UsfmWord
              key={words.length}
              word={content}
              type="word"
              raw={whole}
            />,
          );
        } else if (nextMarkerName === 'wj') {
          // words of jesus
          words.push(
            <UsfmWordGroup
              key={words.length}
              content={content}
              type="words-of-jesus"
              className="text-attention-dark"
            />,
          );
        } else if (nextMarkerName.startsWith('x')) {
          // cross-reference
          words.push(
            <UsfmCrossReference key={words.length} content={content} />,
          );
        } else {
          console.warn(`Unknown marker: ${nextMarkerName}`);
          words.push(
            <UsfmWord
              key={words.length}
              word={whole}
              type="unknown"
              raw={whole}
            />,
          );
        }

        remaining = remaining.slice(remaining.indexOf(whole) + whole.length);
      }
    } else {
      words.push(<span key={words.length}>{remaining}</span>);
      remaining = '';
    }
  }

  return words;
}

function UsfmWordGroup({
  content,
  type,
  className,
}: {
  content: string;
  type: string;
  className?: string;
}) {
  const words = useParsedWords(content);
  return (
    <span data-type={type} className={className} data-raw={content}>
      {words}
    </span>
  );
}

function UsfmWord({
  word,
  type,
  className,
  raw,
}: {
  word: string;
  type: string;
  className?: string;
  raw: string;
}) {
  const [display] = word.split('|');

  return (
    <span className={clsx('word', className)} data-type={type} data-raw={raw}>
      {display}
    </span>
  );
}

function UsfmFootnote({ content }: { content: string }) {
  const textMatch = content.match(/\\ft(.*?)(\\?$)/);
  const text = textMatch?.[1]?.trim() || '';
  if (!text) return null;
  return (
    <Tooltip content={text} className="footnote">
      <span data-type="footnote">*</span>
    </Tooltip>
  );
}

function UsfmCrossReference({ content }: { content: string }) {
  const textMatch = content.match(/\\x(.*?)(\\?$)/);
  const text = textMatch?.[1]?.trim() || '';
  if (!text) return null;
  return (
    <Tooltip content={text} className="cross-reference">
      <span data-type="cross-reference">*</span>
    </Tooltip>
  );
}
