import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { useDebouncedState, useMergedRef } from '@biscuits/client';
import {
  Song,
  SongLinesItem,
  SongLinesItemChordsItem,
  SongLinesItemWordsItem,
} from '@humding.biscuits/verdant';
import {
  forwardRef,
  HTMLAttributes,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDrag } from '@use-gesture/react';
import { clsx } from '@a-type/ui';

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
  const { words, chords } = hooks.useWatch(line);
  hooks.useWatch(words);
  hooks.useWatch(chords);
  const [autoFocus, setAutoFocus] = useState<{
    type: 'chord' | 'word';
    index: number;
  } | null>(null);

  return (
    <div className="col w-full items-start">
      <div className="row w-full overflow-hidden min-w-0 max-w-full">
        {chords.map((chord, i) => (
          <SongViewChord
            chord={chord}
            key={i}
            onInsertBefore={(gap, value) => {
              chords.insert(i, { gap, value });
              setAutoFocus({ type: 'chord', index: i });
            }}
            onInsertAfter={(gap, value) => {
              chords.insert(i + 1, { gap, value });
              setAutoFocus({ type: 'chord', index: i + 1 });
            }}
            autoFocus={autoFocus?.type === 'chord' && autoFocus.index === i}
            onDelete={() => {
              chords.delete(i);
              setAutoFocus({ type: 'chord', index: Math.max(0, i - 1) });
            }}
          />
        ))}
        <Gap
          onClick={({ splitAt }) => {
            chords.push({
              value: 'C',
              gap: splitAt,
            });
          }}
        />
      </div>
      <div className="row w-full">
        {words.map((word, i) => (
          <SongViewWord
            word={word}
            key={i}
            onInsertBefore={(gap, text) => {
              words.insert(i, { gap, text });
              setAutoFocus({ type: 'word', index: i });
            }}
            onInsertAfter={(gap, text, line) => {
              // TODO: line split
              words.insert(i + 1, { gap, text });
              setAutoFocus({ type: 'word', index: i + 1 });
            }}
            autoFocus={autoFocus?.type === 'word' && autoFocus.index === i}
            onDelete={() => {
              console.log('delete word at', i);
              if (words.length === 1) {
                onDelete();
              } else {
                words.delete(i);
                setAutoFocus({ type: 'word', index: Math.max(0, i - 1) });
              }
            }}
          />
        ))}
        <Gap
          onClick={({ splitAt }) => {
            words.push({
              text: '',
              gap: splitAt,
            });
          }}
        />
      </div>
    </div>
  );
}

interface CommonWordProps {
  onInsertBefore: (gap: number, orphan: string) => void;
  onInsertAfter: (gap: number, orphan: string, line: boolean) => void;
  onDelete?: () => void;
  autoFocus?: boolean;
  goToNext?: () => void;
  goToPrevious?: () => void;
  autoSelect?: boolean;
}

function DynamicWord({
  value: syncedValue,
  onChange: onCommitChange,
  gap: syncedGap,
  onGapChange: onCommitGapChange,
  onInsertBefore,
  onInsertAfter,
  onDelete,
  autoFocus,
  goToNext,
  goToPrevious,
  ...rest
}: CommonWordProps & {
  value: string;
  onChange: (v: string) => void;
  gap: number;
  onGapChange: (v: number) => void;
}) {
  // debounce changes so that writes don't happen too frequently
  const [localValue, setLocalValue] = useDebouncedState(
    syncedValue,
    onCommitChange,
  );
  const [localGap, setLocalGap] = useDebouncedState(
    syncedGap,
    onCommitGapChange,
  );

  const bind = useDrag(
    ({ delta: [dx] }) => {
      console.log('gap', localGap + dx);
      setLocalGap(Math.max(0, localGap + dx));
    },
    {
      axis: 'x',
    },
  );

  return (
    <>
      <Gap
        onClick={({ splitAt }) => {
          setLocalGap(localGap - splitAt);
          onInsertBefore(splitAt, '');
        }}
        size={localGap}
      />
      <div className="col">
        <TextField
          value={localValue}
          onValueChange={setLocalValue}
          onSplit={(before, after, line) => {
            setLocalValue(before);
            onInsertAfter(0, after, line);
          }}
          autoFocus={autoFocus}
          onDiscard={onDelete}
          goToNext={goToNext}
          goToPrevious={goToPrevious}
          {...rest}
        />
        <div className="touch-none mx-auto cursor-ew-resize" {...bind()}>
          &lt;&gt;
        </div>
      </div>
    </>
  );
}

function SongViewWord({
  word,
  ...rest
}: {
  word: SongLinesItemWordsItem;
} & CommonWordProps) {
  const { gap, text } = hooks.useWatch(word);
  return (
    <DynamicWord
      gap={gap}
      value={text}
      onChange={(v) => word.set('text', v)}
      onGapChange={(v) => word.set('gap', v)}
      {...rest}
    />
  );
}

function SongViewChord({
  chord,
  ...rest
}: {
  chord: SongLinesItemChordsItem;
} & CommonWordProps) {
  const { gap, value } = hooks.useWatch(chord);
  return (
    <DynamicWord
      gap={gap}
      value={value}
      onChange={(v) => chord.set('value', v)}
      onGapChange={(v) => chord.set('gap', v)}
      autoSelect
      {...rest}
    />
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
          chords: [
            {
              gap: 0,
              value: 'C',
            },
          ],
          words: [
            {
              gap: 0,
              text: '',
            },
          ],
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
