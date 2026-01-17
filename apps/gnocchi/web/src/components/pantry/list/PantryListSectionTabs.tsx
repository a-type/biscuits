import { clsx, Icon, TabsList, TabsRoot, TabsTrigger } from '@a-type/ui';
import { useFilter } from '../hooks.js';

export interface PantryListSectionTabsProps {}

export function PantryListSectionTabs({}: PantryListSectionTabsProps) {
	const [filter, setFilter] = useFilter();

	return (
		<TabsRoot
			value={filter}
			onValueChange={(f) => setFilter(f as 'purchased' | 'all' | 'frozen')}
		>
			<TabsList
				className={clsx(
					'rounded-full [&>*]:text-xs',
					filter === 'frozen' && 'palette-accent',
				)}
				color="primary"
			>
				<TabsTrigger
					className="flex flex-col items-center rounded-full text-nowrap sm:flex-row"
					value="purchased"
				>
					<Icon name="check" />
					<span className="">Purchased</span>
				</TabsTrigger>
				<TabsTrigger
					value="frozen"
					className="flex flex-col rounded-full text-nowrap sm:flex-row"
				>
					<Icon name="snowflake" />
					<span className="">Frozen</span>
				</TabsTrigger>
				<TabsTrigger
					className="flex flex-col items-center rounded-full text-nowrap sm:flex-row"
					value="all"
				>
					<Icon name="food" />
					<span className="">All foods</span>
				</TabsTrigger>
			</TabsList>
		</TabsRoot>
	);
}
