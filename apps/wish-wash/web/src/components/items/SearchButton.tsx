import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useLocalStorage } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';
import { Item } from '@wish-wash.biscuits/verdant';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectIcon,
} from '@a-type/ui/components/select';

export interface SearchButtonProps {
  item: Item;
}

interface SearchConfig {
  name: string;
  template: string;
}
const searchConfigs: Record<string, SearchConfig> = {
  amazon: {
    name: 'Amazon',
    template: 'https://www.amazon.com/s?k=$1',
  },
  ebay: {
    name: 'Ebay',
    template: 'https://www.ebay.com/sch/i.html?_nkw=$1',
  },
  google: {
    name: 'Google',
    template: 'https://www.google.com/search?q=$1',
  },
  walmart: {
    name: 'Walmart',
    template: 'https://www.walmart.com/search/?query=$1',
  },
  target: {
    name: 'Target',
    template: 'https://www.target.com/s?searchTerm=$1',
  },
};

export function SearchButton({ item }: SearchButtonProps) {
  const [selectedProvider, setSelectedProvider] = useLocalStorage(
    'search-provider',
    'amazon',
  );

  return (
    <div className="flex flex-row">
      <Button asChild className="rounded-r-none relative z-1" size="small">
        <Link
          to={searchConfigs[selectedProvider].template.replace(
            '$1',
            item.get('description'),
          )}
          newTab
        >
          <Icon name="search" />
          {searchConfigs[selectedProvider].name}
        </Link>
      </Button>
      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
        <SelectTrigger
          className="rounded-l-none border-l-none !gap-0"
          size="small"
        >
          <SelectValue>{null}</SelectValue>
          <SelectIcon />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(searchConfigs).map(([key, { name }]) => (
            <SelectItem key={key} value={key}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
