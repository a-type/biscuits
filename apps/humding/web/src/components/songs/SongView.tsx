import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { useDebouncedState, useMergedRef } from '@biscuits/client';
import {
  id,
  Song,
  SongLinesItem,
  SongLinesItemWordsItem,
  SongLinesItemWordsItemChords,
  SongLinesItemWordsItemChordsItem,
} from '@humding.biscuits/verdant';
import {
  forwardRef,
  HTMLAttributes,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDrag } from '@use-gesture/react';
import { clsx } from '@a-type/ui';
import { stopPropagation } from '@a-type/utils';

export interface SongViewProps {
  song: Song;
}

export function SongView({ song }: SongViewProps) {
  const { lines } = hooks.useWatch(song);
  hooks.useWatch(lines);
  return (
    <div className="col items-start">
      {lines.map((line, i) => (
        <SongViewLine
          line={line}
          key={i}
          onDelete={() => {
            lines.delete(i);
          }}
        />
      ))}
      <EmptyLine song={song} />
    </div>
  );
}

function SongViewLine({
  line,
  onDelete,
}: {
  line: SongLinesItem;
  onDelete: () => void;
}) {
  const { words } = hooks.useWatch(line);
  hooks.useWatch(words);
  const [autoFocus, setAutoFocus] = useState<string | null>(null);

  return (
    <div className="col w-full items-start">
      <div className="row w-full">
        {words.map((word, i) => (
          <SongViewWord
            word={word}
            key={word.get('id')}
            onInsertBefore={(gap, text) => {
              const wordId = id();
              words.insert(i, { gapEnd: gap, text, id: wordId });
              setAutoFocus(wordId);
            }}
            onInsertAfter={(gap, text, line) => {
              // TODO: line split
              const wordId = id();
              words.insert(i + 1, { gapStart: gap, text, id: wordId });
              setAutoFocus(wordId);
            }}
            autoFocus={autoFocus}
            onDelete={() => {
              if (words.length === 1) {
                onDelete();
              } else {
                words.delete(i);
                const nextWord = words.get(i);
                setAutoFocus(nextWord?.get('id') ?? null);
              }
            }}
          />
        ))}
        <Gap
          onClick={({ splitAt }) => {
            words.push({
              text: '',
              gapStart: splitAt,
            });
          }}
        />
      </div>
    </div>
  );
}

interface SongViewWordProps {
  onInsertBefore: (gap: number, orphan: string) => void;
  onInsertAfter: (gap: number, orphan: string, line: boolean) => void;
  onDelete?: () => void;
  autoFocus?: string | null;
  goToNext?: () => void;
  goToPrevious?: () => void;
  autoSelect?: boolean;
  word: SongLinesItemWordsItem;
}

function SongViewWord({
  word,
  onInsertBefore,
  onInsertAfter,
  onDelete,
  autoFocus,
  goToNext,
  goToPrevious,
  ...rest
}: SongViewWordProps) {
  // FIXME: having both start and end gap is confusing in practice. if a word with an end
  // gap happens before a word with a start gap, the gesture to close the gap just stops
  // at the arbitrary point these two meet and doesn't go any further.
  // I think each word just needs a single starting gap, and the 'end gap' should be
  // the start gap of the next word. This will require cross-word coordination... which
  // is hard with the debouncing...
  const { id, text, gapStart, gapEnd, chords } = hooks.useWatch(word);
  // debounce changes so that writes don't happen too frequently
  const [localValue, setLocalValue] = useDebouncedState(text, (value) =>
    word.set('text', value),
  );
  const [localStartGap, setLocalStartGap] = useDebouncedState(
    gapStart,
    (value) => word.set('gapStart', value),
  );
  const [localEndGap, setLocalEndGap] = useDebouncedState(gapEnd, (value) =>
    word.set('gapEnd', value),
  );

  const bind = useDrag(
    ({ delta: [dx] }) => {
      if (dx < 0) {
        if (localStartGap > 0) {
          setLocalStartGap(localStartGap + dx);
        } else {
          setLocalEndGap(localEndGap - dx);
        }
      } else if (dx > 0) {
        if (localEndGap > 0) {
          setLocalEndGap(localEndGap - dx);
        } else {
          setLocalStartGap(localStartGap + dx);
        }
      }
    },
    {
      axis: 'x',
    },
  );

  return (
    <div className="flex flex-col items-start flex-grow-1 flex-shrink-0 flex-basis-auto">
      <SongViewWordChords chords={chords} />
      <div className="flex flex-row items-start w-full">
        <Gap
          onClick={({ splitAt }) => {
            setLocalStartGap(localStartGap - splitAt);
            onInsertBefore(splitAt, '');
          }}
          size={localStartGap}
        />
        <div className="col flex-1">
          <TextField
            value={localValue}
            onValueChange={setLocalValue}
            onSplit={(before, after, line) => {
              setLocalValue(before);
              onInsertAfter(0, after, line);
            }}
            autoFocus={autoFocus === id}
            onDiscard={onDelete}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            {...rest}
          />
          <div
            className="touch-none mx-auto cursor-ew-resize select-none"
            {...bind()}
          >
            &lt;&gt;
          </div>
        </div>
        <Gap
          onClick={({ splitAt }) => {
            setLocalEndGap(splitAt);
            onInsertAfter(localEndGap - splitAt, '', true);
          }}
          size={localEndGap}
        />
      </div>
    </div>
  );
}

function SongViewWordChords({
  chords,
  ...rest
}: {
  chords: SongLinesItemWordsItemChords;
}) {
  hooks.useWatch(chords);
  const addChord = useCallback((ev: MouseEvent<HTMLDivElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    const xPosition = ev.clientX - rect.left;

    chords.push({
      value: '',
      offset: Math.max(0.1, Math.min(0.9, xPosition / rect.width)),
    });
    ev.stopPropagation();
  }, []);
  return (
    <div className="relative h-[60px] w-full" onClick={addChord} {...rest}>
      {chords.map((chord) => (
        <SongViewChord
          chord={chord}
          key={chord.get('id')}
          onDelete={() => chords.removeAll(chord)}
        />
      ))}
    </div>
  );
}

function SongViewChord({
  chord,
  autoFocus,
  onDelete,
  ...rest
}: {
  chord: SongLinesItemWordsItemChordsItem;
  autoFocus?: boolean;
  onDelete?: () => void;
}) {
  const { value, offset } = hooks.useWatch(chord);
  const [localValue, setLocalValue] = useDebouncedState(value, (value) =>
    chord.set('value', value),
  );
  const [localOffset, setLocalOffset] = useDebouncedState(offset, (value) =>
    chord.set('offset', value),
  );

  const bind = useDrag(
    ({ delta: [dx], event }) => {
      const width = (event.currentTarget as HTMLElement).getBoundingClientRect()
        .width;
      const dxPercent = dx / width;
      setLocalOffset(Math.max(0.1, Math.min(0.9, localOffset + dxPercent)));
    },
    {
      axis: 'x',
    },
  );

  return (
    <div
      className="flex flex-col flex-grow-1 flex-shrink-0 flex-basis-auto absolute z-1"
      style={{
        left: `${localOffset * 100}%`,
      }}
      onClick={stopPropagation}
    >
      <TextField
        value={localValue}
        onValueChange={setLocalValue}
        onSplit={(before, after, line) => {
          setLocalValue(before);
          chord.get('offset') === 0
            ? chord.set('offset', 1)
            : chord.set('offset', 0);
        }}
        autoFocus={autoFocus}
        onDiscard={onDelete}
        {...rest}
      />
      <div
        className="touch-none mx-auto cursor-ew-resize select-none"
        {...bind()}
      >
        &lt;&gt;
      </div>
    </div>
  );
}

function Gap({
  onClick: handleClick,
  size,
}: {
  onClick: (info: { splitAt: number }) => void;
  size?: number;
}) {
  const onClick = (ev: MouseEvent<HTMLButtonElement>) => {
    // get relative x pixel position within button
    const x = ev.clientX - ev.currentTarget.getBoundingClientRect().left;
    handleClick({ splitAt: x });
  };
  return (
    <Button
      color="unstyled"
      style={{
        width: size,
        flex: size === undefined ? 1 : undefined,
      }}
      className="h-6"
      onClick={onClick}
    />
  );
}

function EmptyLine({ song }: { song: Song }) {
  return (
    <Button
      color="unstyled"
      className="py-2 italic text-gray-5 flex-shrink-0"
      onClick={() => {
        song.get('lines').push({
          words: [{}],
        });
      }}
    >
      Write some lyrics...
    </Button>
  );
}

interface TextFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onValueChange: (v: string) => void;
  onSplit: (before: string, after: string, line: boolean) => void;
  autoFocus?: boolean;
  onDiscard?: () => void;
  goToNext?: () => void;
  goToPrevious?: () => void;
  autoSelect?: boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      value,
      onValueChange: onChange,
      onSplit,
      onDiscard,
      autoFocus,
      goToNext,
      goToPrevious,
      className,
      autoSelect,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!innerRef.current) return;
      if (innerRef.current.textContent !== value) {
        innerRef.current.textContent = value;
      }
    });
    useEffect(() => {
      if (!autoFocus) return;
      innerRef.current?.focus();
    }, [autoFocus]);
    const finalRef = useMergedRef(ref, innerRef);
    return (
      <div
        contentEditable="plaintext-only"
        ref={finalRef}
        onKeyDown={(ev) => {
          const cursorPosition = window.getSelection()?.anchorOffset;
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            onSplit(
              value.slice(0, cursorPosition),
              value.slice(cursorPosition),
              ev.key === 'Enter',
            );
          } else if (ev.key === 'Backspace' && value === '') {
            onDiscard?.();
          } else if (ev.key === 'ArrowRight') {
            // are we at the end?
            if (cursorPosition === value.length) {
              goToNext?.();
            }
          } else if (ev.key === 'ArrowLeft') {
            // are we at the start?
            if (cursorPosition === 0) {
              goToPrevious?.();
            }
          }
        }}
        onInput={(ev) => {
          onChange((ev.target as HTMLElement).textContent || '');
        }}
        onFocus={(ev) => {
          if (autoSelect) {
            // select the whole element's content
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(ev.target as HTMLElement);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }}
        onBlur={() => {
          if (value.trim() === '') {
            onDiscard?.();
          }
        }}
        className={clsx(
          'h-full p-1 border-none bg-gray-2 min-w-0px flex-shrink-0 focus:bg-gray-blend',
          className,
        )}
        {...rest}
      />
    );
  },
);
