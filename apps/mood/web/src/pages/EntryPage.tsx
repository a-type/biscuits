import { NavigateEntries } from '@/components/entries/NavigateEntries.jsx';
import { UpsertEntry } from '@/components/entries/UpsertEntry.jsx';
import { FloatingUserMenu } from '@/components/navigation/FloatingUserMenu.jsx';
import { useNavigate, useParams } from '@verdant-web/react-router';
import { startOfDay } from 'date-fns';

const EntryPage = () => {
	const { date: dateStr } = useParams<{ date: string }>();
	const date = dateStr ? new Date(dateStr) : new Date();
	const navigate = useNavigate();

	return (
		<>
			<UpsertEntry date={date} />
			<NavigateEntries
				value={date.getTime()}
				onValueChange={(value: number) => {
					const newDate = startOfDay(new Date(value));
					navigate(
						`/entry/${newDate
							.toLocaleDateString(undefined, {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
							})
							.replaceAll('/', '-')}`,
					);
				}}
			/>
			<FloatingUserMenu />
		</>
	);
};

export default EntryPage;
