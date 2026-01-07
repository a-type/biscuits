import { useSearch } from '@/components/pantry/hooks.js';
import { Button, Icon, LiveUpdateTextField } from '@a-type/ui';

export function PantrySearch() {
	const [search, setSearch] = useSearch();
	return (
		<div className="flex flex-row gap-1 items-center">
			<LiveUpdateTextField
				placeholder="Search foods"
				value={search}
				onChange={setSearch}
				className="flex-1 rounded-full"
			/>
			{!!search && (
				<Button emphasis="default" onClick={() => setSearch('')}>
					<Icon name="x" />
				</Button>
			)}
		</div>
	);
}
