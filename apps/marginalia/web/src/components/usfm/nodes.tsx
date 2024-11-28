import {
	createContext,
	Fragment,
	JSX,
	ReactNode,
	useContext,
	useId,
	useMemo,
} from 'react';
import { Reference } from './Reference.jsx';

export interface Node {
	markers: string[];
	consume?: (
		line: string,
		marker: string,
	) => { consumed: string; rest: string };
	Component?: (props: { consumed: string; marker: string }) => JSX.Element;
	multiline?: boolean;
}

const MARKER = /\\(\S+)/;
// by default markers consume to either
// the end of the line, or an inverse marker
const DEFAULT_CONSUME = (line: string, marker: string) => {
	// escape special characters in marker
	marker = marker.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	const inverse = new RegExp(`\\\\${marker}\\*`);
	const inverseMatch = line.match(inverse);
	if (inverseMatch?.index !== undefined) {
		// remove both leading and inverse markers
		const source = line.slice(marker.length + 1, inverseMatch.index);
		return {
			consumed: source,
			rest: line.slice(inverseMatch.index + inverseMatch[0].length),
		};
	}

	// otherwise, remove leading marker and return
	// rest of line
	return { consumed: line.slice(marker.length + 1), rest: '' };
};
const PARAGRAPH_CONSUME = (line: string, marker: string) => {
	// paragraphs consume up to the next multiline marker
	const nextMarker = new RegExp(`\\\\(${MULTILINE_MARKERS.join('|')})`);
	const withoutMarker = line.slice(marker.length + 1);
	const nextMatch = withoutMarker.match(nextMarker);
	if (nextMatch?.index !== undefined) {
		if (nextMatch.index === 0) {
			debugger;
		}
		const source = withoutMarker.slice(0, nextMatch.index);
		return {
			consumed: source,
			rest: withoutMarker.slice(nextMatch.index),
		};
	}

	// otherwise, consume the whole line
	return { consumed: withoutMarker, rest: '' };
};
// eats everything after it - only used for context-creation,
// should not be used for markers that render content
const EVERYTHING_CONSUME = (line: string, marker: string) => {
	return { consumed: line, rest: '' };
};

// invisible by default
const DEFAULT_RENDER = () => null;

function render(text: string, key: string) {
	let remaining = text;
	let content: ReactNode[] = [];
	let match: Node | undefined = undefined;
	let prevRemaining = remaining;
	let i = 0;
	do {
		i++;
		match = undefined; // reset

		const marker = MARKER.exec(remaining);
		if (marker) {
			// add any text before the marker
			if (marker.index > 0) {
				const leading = remaining.slice(0, marker.index);
				remaining = remaining.slice(marker.index);
				content.push(
					<span data-type="text" key={`${key}-${i}-leading`}>
						{leading}
					</span>,
				);
			}
			// find node for marker
			match = nodeMap.get(marker[1]) ?? DEFAULT_NODE;

			const consume =
				match.consume ??
				(match.multiline ? PARAGRAPH_CONSUME : DEFAULT_CONSUME);
			const Comp = match.Component ?? DEFAULT_RENDER;
			let matchAgainst;
			let leftovers;
			if (match.multiline) {
				matchAgainst = remaining;
				leftovers = '';
			} else {
				const [line, ...otherLines] = remaining.split('\n');
				matchAgainst = line;
				leftovers = otherLines.join('\n');
			}
			const { consumed, rest } = consume(matchAgainst, marker[1]);
			content.push(
				<Comp key={`${key}-${i}`} consumed={consumed} marker={marker[1]} />,
			);
			remaining = rest + leftovers;

			if (prevRemaining === remaining) {
				throw new Error(
					'infinite loop detected. current marker: ' +
						marker[1] +
						' remaining: ' +
						remaining,
				);
			}
			prevRemaining = remaining;
		} else {
			// add any text after markers.
			content.push(
				<span data-type="text" key={`${key}-${i}-trailing`}>
					{remaining}
				</span>,
			);
		}
	} while (remaining.length > 0 && match !== undefined);

	return content;
}

export function UsfmNode({ text }: { text: string }) {
	const id = useId();
	const content = useMemo(() => render(text, id), [text, id]);
	return <Fragment>{content}</Fragment>;
}

const DEFAULT_NODE: Node = {
	markers: [],
	consume: DEFAULT_CONSUME,
	Component: ({ consumed, marker, ...props }) => (
		<span
			data-type="unknown"
			className="text-amber"
			data-marker={marker}
			{...props}
		>
			[\{marker}] {consumed}
		</span>
	),
};

const NodeContext = createContext<{ chapterWord: string }>({
	chapterWord: '',
});

const chapter: Node = {
	markers: ['c'],
	Component: ({ consumed, ...props }) => {
		const number = parseInt(consumed, 10);
		const { chapterWord } = useContext(NodeContext);
		return (
			<span
				className="text-xl font-bold block"
				data-type="chapter-number"
				{...props}
			>
				{chapterWord ? `${chapterWord} ` : ''}
				{number}
			</span>
		);
	},
};

const chapterLabel: Node = {
	markers: ['cl'],
	consume: EVERYTHING_CONSUME,
	Component: ({ consumed, ...props }) => {
		const firstLine = consumed.split('\n')[0];
		return (
			<NodeContext.Provider
				value={{
					chapterWord: firstLine,
				}}
				{...props}
			>
				<UsfmNode text={consumed.replace(firstLine, '')} />
			</NodeContext.Provider>
		);
	},
};

const paragraph: Node = {
	// todo: differentiate types of paragraphs?
	markers: ['p', 'pm', 'pmo', 'pmc', 'pmr'],
	Component: ({ consumed, ...props }) => {
		return (
			<div data-type="paragraph" className="indent" {...props}>
				<UsfmNode text={consumed} />
			</div>
		);
	},
	multiline: true,
};

const verse: Node = {
	markers: ['v'],
	Component: ({ consumed, ...props }) => {
		const trimmed = consumed.trimStart();
		// first thing should be a number
		const firstSpaceIndex = trimmed.indexOf(' ');
		const number = parseInt(trimmed.slice(0, firstSpaceIndex), 10);
		const rest = trimmed.slice(firstSpaceIndex + 1);
		return (
			<span data-type="verse" className="inline" {...props}>
				<span className="text-xs italic vertical-super">{number}</span>
				<UsfmNode text={rest} />
			</span>
		);
	},
};

const word: Node = {
	markers: ['w', '+w'],
	Component: ({ consumed, ...props }) => {
		// remove strong's reference
		const [word, strongs, ...extras] = consumed.split('|');
		if (extras.length > 0) {
			console.error('unexpected extra data in word: ' + extras.join('|'));
		}
		return (
			<span data-type="word" data-strongs={strongs} {...props}>
				{word.trim()}
			</span>
		);
	},
};

const quote: Node = {
	markers: ['q', 'q1', 'q2', 'q3', 'q4', 'q5'],
	multiline: true,
	Component: ({ consumed, marker, ...props }) => {
		const level = parseInt(marker.slice(1), 10);
		return (
			<blockquote
				className="my-0 leading-loose"
				style={{
					marginLeft: `${level * 1}rem`,
					textIndent: `${level * 1}rem`,
				}}
				{...props}
			>
				<UsfmNode text={consumed} />
			</blockquote>
		);
	},
};

const crossReference: Node = {
	markers: ['x'],
	Component: ({ consumed, ...props }) => {
		// parse caller
		const [caller, ...rest] = consumed.trim().split(' ');

		return (
			<Reference caller={caller} {...props}>
				<UsfmNode text={rest.join(' ')} />
			</Reference>
		);
	},
};

const crossReferenceText: Node = {
	markers: ['xt'],
	Component: ({ consumed, ...props }) => {
		return (
			<span data-type="cross-reference-text" {...props}>
				{consumed}
			</span>
		);
	},
};

const majorTitle: Node = {
	markers: ['mt1', 'mt2', 'mt3'],
	Component: ({ consumed, marker, ...props }) => {
		if (marker === 'mt1') {
			return (
				<h1 className="block" {...props}>
					{consumed}
				</h1>
			);
		} else if (marker === 'mt2') {
			return (
				<h2 className="block italic" {...props}>
					{consumed}
				</h2>
			);
		}
		return <b {...props}>{consumed}</b>;
	},
};

const majorSection: Node = {
	markers: ['ms1', 'ms2', 'ms3', 'ms4', 'ms5', 'ms6'],
	Component: ({ consumed, marker, ...props }) => {
		const level = parseInt(marker.slice(2), 10);
		return (
			<h3
				className="block"
				style={{ marginLeft: `${level * 1}rem` }}
				{...props}
			>
				{consumed}
			</h3>
		);
	},
};

const footnote: Node = {
	markers: ['f'],
	Component: ({ consumed, ...props }) => {
		// parse caller
		const [caller, ...rest] = consumed.trim().split(' ');

		return (
			<Reference caller={caller} {...props}>
				<UsfmNode text={rest.join(' ')} />
			</Reference>
		);
	},
};

const footnoteText: Node = {
	markers: ['ft'],
	Component: ({ consumed, ...props }) => {
		return (
			<span data-type="footnote-text" {...props}>
				{consumed}
			</span>
		);
	},
};

const wordsOfJesus: Node = {
	markers: ['wj'],
	Component: ({ consumed, ...props }) => {
		return (
			<span className="text-red" data-type="words-of-jesus" {...props}>
				<UsfmNode text={consumed} />
			</span>
		);
	},
};

const closing: Node = {
	markers: ['cls'],
	multiline: true,
	Component: ({ consumed, ...props }) => {
		return (
			<span
				className="self-end text-end w-full inline-block"
				data-type="closing"
				{...props}
			>
				<UsfmNode text={consumed} />
			</span>
		);
	},
};

const selah: Node = {
	markers: ['qs'],
	Component: ({ consumed, ...props }) => {
		return (
			<span
				className="self-end text-end italic w-full inline-block"
				data-type="selah"
				{...props}
			>
				<UsfmNode text={consumed} />
			</span>
		);
	},
};

const descriptive: Node = {
	markers: ['d'],
	Component: ({ consumed, ...props }) => {
		return (
			<span data-type="descriptive" className="italic" {...props}>
				{consumed}
			</span>
		);
	},
};

const blankLine: Node = {
	markers: ['b'],
	Component: ({ consumed, marker, ...props }) => <br {...props} />,
};

// omitted
const toc: Node = {
	markers: ['toc1', 'toc2', 'toc3'],
};
const id: Node = {
	markers: ['id', 'ide'],
};
const heading: Node = {
	markers: ['h'],
};
const footnoteReference: Node = {
	markers: ['fr'],
	consume: (line) => {
		// only consumes the marker and reference
		const match = line.match(/\\fr \d+\D\d+/);
		if (!match) {
			// invalid reference? just consume the
			// marker and return the rest
			const rest = line.split('\\fr')[1];
			return { consumed: '', rest };
		}
		return { consumed: match[0], rest: line.slice(match[0].length) };
	},
};
const crossReferenceReference: Node = {
	markers: ['xo'],
	consume: (line) => {
		// only consumes the marker and reference
		const match = line.match(/\\xo \d+\D\d+/);
		if (!match) {
			// invalid reference? just consume the
			// marker and return the rest
			const rest = line.split('\\xo')[1];
			return { consumed: '', rest };
		}
		return { consumed: match[0], rest: line.slice(match[0].length) };
	},
};

const nodes = [
	id,
	chapter,
	paragraph,
	verse,
	heading,
	word,
	quote,
	crossReference,
	toc,
	majorTitle,
	footnote,
	footnoteReference,
	footnoteText,
	crossReferenceReference,
	crossReferenceText,
	wordsOfJesus,
	closing,
	chapterLabel,
	majorSection,
	selah,
	descriptive,
	blankLine,
];

const nodeMap = new Map<string, Node>();
nodes.forEach((node) => {
	node.markers.forEach((marker) => {
		nodeMap.set(marker, node);
	});
});

const MULTILINE_MARKERS = nodes
	.filter((node) => node.multiline)
	.flatMap((node) => node.markers);
