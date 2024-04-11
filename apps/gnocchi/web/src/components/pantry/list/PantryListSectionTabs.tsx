import { TabsList, TabsRoot, TabsTrigger } from '@a-type/ui/components/tabs';
import { useFilter } from '../hooks.js';

export interface PantryListSectionTabsProps {}

export function PantryListSectionTabs({}: PantryListSectionTabsProps) {
  const [filter, setFilter] = useFilter();

  return (
    <TabsRoot
      value={filter}
      onValueChange={(f) => setFilter(f as 'purchased' | 'all' | 'frozen')}
      className="overflow-x-auto"
    >
      <TabsList>
        <TabsTrigger className="text-nowrap" value="purchased">
          Purchased
        </TabsTrigger>
        <TabsTrigger value="frozen" className="text-nowrap theme-leek">
          Frozen
        </TabsTrigger>
        <TabsTrigger className="text-nowrap" value="all">
          All foods
        </TabsTrigger>
      </TabsList>
    </TabsRoot>
  );
}
