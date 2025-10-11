import { Icon, TabsList, TabsRoot, TabsTrigger } from '@a-type/ui';
import { useFilter } from '../hooks.js';

export interface PantryListSectionTabsProps {}

export function PantryListSectionTabs({}: PantryListSectionTabsProps) {
	const [filter, setFilter] = useFilter();

	return (
		<TabsRoot
			value={filter}
			onValueChange={(f) => setFilter(f as 'purchased' | 'all' | 'frozen')}
			className="overflow-x-auto overflow-y-hidden"
		>
			<TabsList>
				<TabsTrigger className="text-nowrap" value="purchased">
					<Icon name="check" />
					Purchased
				</TabsTrigger>
				<TabsTrigger value="frozen" className="text-nowrap">
					<Icon name="snowflake" />
					Frozen
				</TabsTrigger>
				<TabsTrigger className="text-nowrap" value="all">
					<Icon name="food" />
					All foods
				</TabsTrigger>
			</TabsList>
		</TabsRoot>
	);
}
