import { UsfmNode } from '../usfm/nodes.jsx';
import { useBook } from './hooks.js';

export interface ChapterProps {
	bookId: string;
	number: number;
}

export function Chapter({ bookId, number }: ChapterProps) {
	const { data: book } = useBook(bookId);
	const chapter = getChapter(book, number);

	if (!chapter) {
		return <div>Chapter not found</div>;
	}

	return (
		<article className="leading-loose">
			<UsfmNode text={chapter} />
		</article>
	);
}

function getChapter(bookText: string, chapterNumber: number) {
	// everything from "\c ${chapterNumber}" to the next "\c" or end of file.
	const chapterRegex = new RegExp(`\\\\c ${chapterNumber}(.*?)\\\\c`, 's');
	const chapterMatch = bookText.match(chapterRegex);
	if (!chapterMatch) {
		return null;
	}
	return chapterMatch[1];
}
