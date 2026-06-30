import { useSearch } from '@/components/pantry/hooks.js';
import { Box, Button, Icon, LiveUpdateTextField } from '@a-type/ui';

export function PantrySearch() {
	const [search, setSearch] = useSearch();
	return (
		<Box items="center" gap="xs" full="width">
			<LiveUpdateTextField
				placeholder="Search foods"
				value={search}
				onChange={setSearch}
				style={{ flex: 1 }}
			/>
			{!!search && (
				<Button emphasis="default" onClick={() => setSearch('')}>
					<Icon name="x" />
				</Button>
			)}
		</Box>
	);
}
