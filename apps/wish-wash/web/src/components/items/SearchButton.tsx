import {
	Box,
	Button,
	Icon,
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@a-type/ui';
import { useLocalStorage } from '@biscuits/client';

import { Item } from '@wish-wash.biscuits/verdant';

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
		<Box>
			<Button
				style={{
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0,
					zIndex: 1,
					position: 'relative',
				}}
				size="small"
				render={
					<a
						href={searchConfigs[selectedProvider].template.replace(
							'$1',
							item.get('description'),
						)}
						target="_blank"
						rel="noopener noreferrer"
					/>
				}
			>
				<Icon name="search" />
				{searchConfigs[selectedProvider].name}
			</Button>
			<Select
				value={selectedProvider}
				onValueChange={(v) => (v ? setSelectedProvider(v) : undefined)}
			>
				<SelectTrigger
					style={{
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
					}}
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
		</Box>
	);
}
