import { NavigateEntries } from '@/components/entries/NavigateEntries.jsx';
import { UpsertEntry } from '@/components/entries/UpsertEntry.jsx';
import { useNavigate } from '@verdant-web/react-router';
import { startOfDay } from 'date-fns';

export function HomePage() {
	const today = startOfDay(new Date());
	const navigate = useNavigate();

	return (
		<>
			<UpsertEntry date={today} />
			<NavigateEntries
				value={today.getTime()}
				onValueChange={(value: number) => {
					const newDate = startOfDay(new Date(value));
					navigate(`/entry/${newDate.toISOString()}`);
				}}
			/>
		</>
	);
}

export default HomePage;
