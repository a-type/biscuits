import { NavigateEntries } from '@/components/entries/NavigateEntries.jsx';
import { UpsertEntry } from '@/components/entries/UpsertEntry.jsx';
import { FloatingUserMenu } from '@/components/navigation/FloatingUserMenu.jsx';
import { InstallHint } from '@biscuits/client/apps';
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
			<FloatingUserMenu />
			<InstallHint content="Install the app for quick access" />
		</>
	);
}

export default HomePage;
