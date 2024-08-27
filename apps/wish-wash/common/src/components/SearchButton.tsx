import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectContent,
	SelectValue,
	SelectIcon,
} from '@a-type/ui/components/select';
import { clsx } from '@a-type/ui';
import { useState } from 'react';

export interface SearchButtonProps {
	prompt: string;
	provider?: keyof typeof searchConfigs;
}

const searchConfigs = {
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
} as const;
export const searchProviders = Object.keys(
	searchConfigs,
) as (keyof typeof searchConfigs)[];

export function SearchButton({ prompt, provider }: SearchButtonProps) {
	const [selectedProvider, setSelectedProvider] =
		useState<keyof typeof searchConfigs>('amazon');
	const finalProvider = provider || selectedProvider;

	return (
		<div className="flex flex-row">
			<Button
				asChild
				className={clsx(
					'rounded-r-none relative z-1',
					!provider && 'rounded-r-none',
				)}
				size="small"
			>
				<a
					href={searchConfigs[finalProvider].template.replace('$1', prompt)}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Icon name="search" />
					{searchConfigs[finalProvider].name}
				</a>
			</Button>
			{!provider && (
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
			)}
		</div>
	);
}
