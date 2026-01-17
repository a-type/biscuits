import { useSearch } from '@/components/pantry/hooks.js';
import { Button, Icon, LiveUpdateTextField } from '@a-type/ui';

export function PantrySearch() {
	const [search, setSearch] = useSearch();
	return (
		<div className="flex flex-row items-center gap-1">
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
