import { books } from '@/data/books.js';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@a-type/ui';

export interface ChapterSelectProps {
	book: string;
	value: string;
	onValueChange: (value: string) => void;
}

export function ChapterSelect({
	book,
	value,
	onValueChange,
}: ChapterSelectProps) {
	const matchingBook = books.find((b) => b.id === book);

	if (!matchingBook) return null;

	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger />
			<SelectContent>
				{Array.from({ length: matchingBook.chapters }, (_, i) => i + 1).map(
					(chapter) => (
						<SelectItem value={chapter.toString()} key={chapter}>
							{chapter}
						</SelectItem>
					),
				)}
			</SelectContent>
		</Select>
	);
}
