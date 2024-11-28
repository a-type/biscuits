import { Book } from '@/components/text/Book.jsx';
import { BookSelect } from '@/components/text/BookSelect.jsx';
import { PageContent, PageFixedArea } from '@a-type/ui';
import { useNavigate, useParams } from '@verdant-web/react-router';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	const { code = '92-1JN' } = useParams();
	const navigate = useNavigate();

	return (
		<PageContent>
			<PageFixedArea className="items-start">
				<BookSelect
					value={code}
					onValueChange={(val) => {
						navigate('/' + val);
					}}
				/>
			</PageFixedArea>
			<Book id={code} />
		</PageContent>
	);
}

export default HomePage;
