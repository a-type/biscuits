import { useSearch } from '@/components/pantry/hooks.js';
import { PantryListItem } from '@/components/pantry/items/PantryListItem.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Box, Button, CardGrid } from '@a-type/ui';

export interface PantrySearchResultsProps {}

export function PantrySearchResults({}: PantrySearchResultsProps) {
	const [search] = useSearch();
	const [results, pagination] = hooks.useAllFoodsInfinite({
		index: {
			where: 'nameLookup',
			startsWith: search.toLowerCase(),
		},
		key: 'food-search',
	});

	if (!results.length) {
		return <div>No results</div>;
	}

	return (
		<Box col items="center" gap>
			<CardGrid
				style={{
					width: '100%',
					gridTemplateColumns: 'repeat(2, 1fr)',
				}}
			>
				{results.map((item) => {
					return <PantryListItem key={item.get('canonicalName')} item={item} />;
				})}
			</CardGrid>
			{pagination.hasMore && (
				<Button emphasis="ghost" onClick={pagination.loadMore}>
					Load more
				</Button>
			)}
		</Box>
	);
}
