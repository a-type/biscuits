import { hooks } from '@/store.js';
import { Button, clsx } from '@a-type/ui';
import { stopPropagation } from '@a-type/utils';
import { useMergedRef } from '@biscuits/client';
import {
	id,
	Song,
	SongLinesItem,
	SongLinesItemWordsItem,
	SongLinesItemWordsItemChords,
	SongLinesItemWordsItemChordsItem,
	SongLinesItemWordsItemInit,
} from '@humding.biscuits/verdant';
import { useDrag } from '@use-gesture/react';
import {
	forwardRef,
	HTMLAttributes,
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
} from 'react';
import { proxy, useSnapshot } from 'valtio';

export interface SongViewProps {
	song: Song;
}

const focusState = proxy({
	id: null as string | null,
});

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
					onPush={(word) => {
						lines.push({
							words: [word],
						});
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
	onPush,
}: {
	line: SongLinesItem;
	onDelete: () => void;
	onPush: (word: SongLinesItemWordsItemInit) => void;
}) {
	const { words } = hooks.useWatch(line);
	hooks.useWatch(words);

	return (
		<div className="col w-full items-start overflow-x-hidden">
			<div className="row w-full flex-wrap">
				{words.map((word, i) => (
					<SongViewWord
						word={word}
						wordIndex={i}
						last={i === words.length - 1}
						line={line}
						key={word.get('id')}
						onInsertBefore={(gap, text) => {
							const wordId = id();
							words.insert(i, { text, id: wordId });
							focusState.id = wordId;
						}}
						onInsertAfter={(gap, text, line) => {
							const wordId = id();
							if (line) {
								onPush({ text, id: wordId });
							} else {
								words.insert(i + 1, { gapStart: gap, text, id: wordId });
							}
							focusState.id = wordId;
						}}
						onDelete={() => {
							if (words.length === 1) {
								onDelete();
							} else {
								words.delete(i);
								if (i > 0) {
									const nextWord = words.get(i - 1);
									focusState.id = nextWord?.get('id') ?? null;
								} else {
									// TODO: focus last word of previous line when deleting
									// first word of line.
									focusState.id = null;
								}
							}
						}}
					/>
				))}
			</div>
		</div>
	);
}

interface SongViewWordProps {
	onInsertBefore: (gap: number, orphan: string) => void;
	onInsertAfter: (gap: number, orphan: string, line: boolean) => void;
	onDelete?: () => void;
	goToNext?: () => void;
	goToPrevious?: () => void;
	autoSelect?: boolean;
	word: SongLinesItemWordsItem;
	line: SongLinesItem;
	wordIndex: number;
	last: boolean;
}

function SongViewWord({
	word,
	line,
	wordIndex,
	last,
	onInsertBefore,
	onInsertAfter,
	onDelete,
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
	const { id, text, gapStart, chords } = hooks.useWatch(word);

	const bind = useDrag(
		({ delta: [dx] }) => {
			const nextWord = line.get('words').get(wordIndex + 1);

			if (dx < 0) {
				if (gapStart > 0) {
					word.set('gapStart', gapStart + dx);
				} else {
					// if next word, reduce its gap start
					if (nextWord) {
						nextWord.set('gapStart', nextWord.get('gapStart') - dx);
					}
				}
			} else if (dx > 0) {
				if (nextWord && nextWord.get('gapStart') > 0) {
					nextWord.set('gapStart', nextWord.get('gapStart') - dx);
				} else {
					word.set('gapStart', gapStart + dx);
				}
			}
		},
		{
			axis: 'x',
		},
	);

	const wordFocused = useSnapshot(focusState).id === id;

	return (
		<div className="flex flex-col items-start flex-shrink-0 flex-basis-auto">
			<SongViewWordChords chords={chords} />
			<div className="flex flex-row items-start">
				<Gap
					onClick={({ splitAt }) => {
						word.set('gapStart', gapStart - splitAt);
						onInsertBefore(splitAt, '');
					}}
					size={gapStart}
				/>
				<div className="col flex-1">
					<TextField
						value={text}
						onValueChange={(v) => word.set('text', v)}
						onSplit={(before, after, line) => {
							word.set('text', before);
							onInsertAfter(0, after, line);
						}}
						autoFocus={wordFocused}
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
			offset: Math.max(0.1 * rect.width, Math.min(0.9 * rect.width, xPosition)),
		});
		ev.stopPropagation();
	}, []);

	return (
		<div className="relative h-[60px]" onClick={addChord} {...rest}>
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
	onDelete,
	...rest
}: {
	chord: SongLinesItemWordsItemChordsItem;
	onDelete?: () => void;
}) {
	const { id, value, offset } = hooks.useWatch(chord);

	const chordFocused = useSnapshot(focusState).id === id;

	const bind = useDrag(
		({ delta: [dx], event }) => {
			chord.set('offset', Math.max(0, offset + dx));
		},
		{
			axis: 'x',
		},
	);

	return (
		<div
			className="flex flex-col flex-grow-1 flex-shrink-0 flex-basis-auto z-1"
			style={{
				marginLeft: offset,
			}}
			onClick={stopPropagation}
		>
			<TextField
				value={value}
				onValueChange={(v) => chord.set('value', v)}
				onSplit={(before, after, line) => {
					chord.set('value', before);
					chord.get('offset') === 0 ?
						chord.set('offset', 1)
					:	chord.set('offset', 0);
				}}
				autoFocus={chordFocused}
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
	className,
}: {
	onClick: (info: { splitAt: number }) => void;
	size?: number;
	className?: string;
}) {
	const onClick = (ev: MouseEvent<HTMLButtonElement>) => {
		// get relative x pixel position within button
		const x = ev.clientX - ev.currentTarget.getBoundingClientRect().left;
		handleClick({ splitAt: x });
	};
	return (
		<Button
			data-testid="gap"
			color="unstyled"
			style={{
				width: size,
				flexBasis: size,
			}}
			className={clsx('h-6', className)}
			onClick={onClick}
		/>
	);
}

function EmptyLine({ song }: { song: Song }) {
	return (
		<Button
			color="unstyled"
			className="py-2 italic color-gray flex-shrink-0"
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
					'h-full p-1 border-none bg-gray-light min-w-0px flex-shrink-0 focus:bg-gray-blend',
					className,
				)}
				{...rest}
			/>
		);
	},
);
