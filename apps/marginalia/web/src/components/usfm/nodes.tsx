import { ReactNode, JSX } from 'react';
import { Reference } from './Reference.jsx';

export interface Node {
  markers: string[];
  consume?: (
    line: string,
    marker: string,
  ) => { consumed: string; rest: string };
  render?: (consumed: string, marker: string) => JSX.Element | null;
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

// invisible by default
const DEFAULT_RENDER = () => null;

export function UsfmNode({ text }: { text: string }) {
  let remaining = text;
  let content: ReactNode[] = [];
  let match: Node | undefined = undefined;
  let prevRemaining = remaining;
  do {
    match = undefined; // reset

    const marker = MARKER.exec(remaining);
    if (marker) {
      // add any text before the marker
      if (marker.index > 0) {
        const leading = remaining.slice(0, marker.index);
        remaining = remaining.slice(marker.index);
        content.push(<span data-type="text">{leading}</span>);
      }
      // find node for marker
      match = nodeMap.get(marker[1]) ?? DEFAULT_NODE;

      const consume =
        match.consume ??
        (match.multiline ? PARAGRAPH_CONSUME : DEFAULT_CONSUME);
      const render = match.render ?? DEFAULT_RENDER;
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
      content.push(render(consumed, marker[1]));
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
      content.push(<span data-type="text">{remaining}</span>);
    }
  } while (remaining.length > 0 && match !== undefined);

  return <>{content}</>;
}

const DEFAULT_NODE: Node = {
  markers: [],
  consume: DEFAULT_CONSUME,
  render: (consumed, marker) => (
    <span data-type="unknown" className="text-amber" data-marker={marker}>
      [\{marker}] {consumed}
    </span>
  ),
};

const chapter: Node = {
  markers: ['c'],
  render: (consumed) => {
    const number = parseInt(consumed, 10);
    return (
      <span className="text-xl font-bold block" data-type="chapter-number">
        {number}
      </span>
    );
  },
};

const paragraph: Node = {
  markers: ['p'],
  render: (consumed) => {
    return (
      <div data-type="paragraph" className="indent">
        <UsfmNode text={consumed} />
      </div>
    );
  },
  multiline: true,
};

const verse: Node = {
  markers: ['v'],
  render: (consumed) => {
    const trimmed = consumed.trimStart();
    // first thing should be a number
    const firstSpaceIndex = trimmed.indexOf(' ');
    const number = parseInt(trimmed.slice(0, firstSpaceIndex), 10);
    const rest = trimmed.slice(firstSpaceIndex + 1);
    return (
      <span data-type="verse" className="inline" key={`v-${number}`}>
        <span className="text-xs italic vertical-super">{number}</span>
        <UsfmNode text={rest} />
      </span>
    );
  },
};

const word: Node = {
  markers: ['w', '+w'],
  render: (consumed) => {
    // remove strong's reference
    const [word, strongs, ...extras] = consumed.split('|');
    if (extras.length > 0) {
      console.error('unexpected extra data in word: ' + extras.join('|'));
    }
    return (
      <span data-type="word" data-strongs={strongs}>
        {word.trim()}
      </span>
    );
  },
};

const quote: Node = {
  markers: ['q', 'q1', 'q2', 'q3', 'q4', 'q5'],
  multiline: true,
  render: (consumed, marker) => {
    const level = parseInt(marker.slice(1), 10);
    return (
      <blockquote
        className="my-0 leading-loose"
        style={{
          marginLeft: `${level * 1}rem`,
          textIndent: `${level * 1}rem`,
        }}
      >
        <UsfmNode text={consumed} />
      </blockquote>
    );
  },
};

const crossReference: Node = {
  markers: ['x'],
  render: (consumed) => {
    // parse caller
    const [caller, ...rest] = consumed.trim().split(' ');

    return (
      <Reference caller={caller}>
        <UsfmNode text={rest.join(' ')} />
      </Reference>
    );
  },
};

const crossReferenceText: Node = {
  markers: ['xt'],
  render: (consumed) => {
    return <span data-type="cross-reference-text">{consumed}</span>;
  },
};

const majorTitle: Node = {
  markers: ['mt1', 'mt2', 'mt3'],
  render: (consumed, marker) => {
    if (marker === 'mt1') {
      return <h1 className="block">{consumed}</h1>;
    } else if (marker === 'mt2') {
      return <h2 className="block italic">{consumed}</h2>;
    }
    return <b>{consumed}</b>;
  },
};

const footnote: Node = {
  markers: ['f'],
  render: (consumed) => {
    // parse caller
    const [caller, ...rest] = consumed.trim().split(' ');

    return (
      <Reference caller={caller}>
        <UsfmNode text={rest.join(' ')} />
      </Reference>
    );
  },
};

const footnoteText: Node = {
  markers: ['ft'],
  render: (consumed) => {
    return <span data-type="footnote-text">{consumed}</span>;
  },
};

const wordsOfJesus: Node = {
  markers: ['wj'],
  render: (consumed) => {
    return (
      <span className="text-red" data-type="words-of-jesus">
        <UsfmNode text={consumed} />
      </span>
    );
  },
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
