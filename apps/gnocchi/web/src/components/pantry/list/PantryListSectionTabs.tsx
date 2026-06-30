import { clsx, Icon, TabsList, TabsRoot, TabsTrigger } from '@a-type/ui';
import { useFilter } from '../hooks.js';

export interface PantryListSectionTabsProps {}

export function PantryListSectionTabs({}: PantryListSectionTabsProps) {
	const [filter, setFilter] = useFilter();

	return (
		<TabsRoot
			value={filter}
			onValueChange={(f) => setFilter(f as 'purchased' | 'all' | 'frozen')}
			style={{ minWidth: 0 }}
		>
			<TabsList
				className={clsx(filter === 'frozen' && '@mode-accent')}
				style={{ minWidth: 0, maxWidth: '98dvw' }}
				color="primary"
			>
				<TabsTrigger value="purchased">
					<Icon name="check" />
					<span className="">Purchased</span>
				</TabsTrigger>
				<TabsTrigger value="frozen">
					<Icon name="snowflake" />
					<span className="">Frozen</span>
				</TabsTrigger>
				<TabsTrigger value="all">
					<Icon name="food" />
					<span className="">All</span>
				</TabsTrigger>
			</TabsList>
		</TabsRoot>
	);
}
