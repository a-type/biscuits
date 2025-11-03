import { Icon, TabsList, TabsRoot, TabsTrigger } from '@a-type/ui';
import { useFilter } from '../hooks.js';

export interface PantryListSectionTabsProps {}

export function PantryListSectionTabs({}: PantryListSectionTabsProps) {
	const [filter, setFilter] = useFilter();

	return (
		<TabsRoot
			value={filter}
			onValueChange={(f) => setFilter(f as 'purchased' | 'all' | 'frozen')}
		>
			<TabsList className="[&>*]:text-xs">
				<TabsTrigger
					className="text-nowrap flex flex-col items-center sm:flex-row"
					value="purchased"
				>
					<Icon name="check" />
					<span className="">Purchased</span>
				</TabsTrigger>
				<TabsTrigger
					value="frozen"
					className="text-nowrap flex flex-col sm:flex-row palette-accent"
				>
					<Icon name="snowflake" />
					<span className="">Frozen</span>
				</TabsTrigger>
				<TabsTrigger
					className="text-nowrap flex flex-col items-center sm:flex-row"
					value="all"
				>
					<Icon name="food" />
					<span className="">All foods</span>
				</TabsTrigger>
			</TabsList>
		</TabsRoot>
	);
}
