import { BookSelect } from '@/components/text/BookSelect.jsx';
import { Chapter } from '@/components/text/Chapter.jsx';
import { ChapterSelect } from '@/components/text/ChapterSelect.jsx';
import { PageContent, PageFixedArea } from '@a-type/ui';
import { useNavigate, useParams } from '@verdant-web/react-router';

export interface ChapterPageProps {}

export function ChapterPage({}: ChapterPageProps) {
	const { code = '92-1JN', chapter = '1' } = useParams();
	const navigate = useNavigate();

	return (
		<PageContent>
			<PageFixedArea className="items-start row">
				<BookSelect
					value={code}
					onValueChange={(book) => {
						navigate(`/${book}/1`);
					}}
				/>
				<ChapterSelect
					book={code}
					value={chapter}
					onValueChange={(chapter) => {
						navigate(`/${code}/${chapter}`);
					}}
				/>
			</PageFixedArea>
			<Chapter bookId={code} number={parseInt(chapter)} />
		</PageContent>
	);
}

export default ChapterPage;
