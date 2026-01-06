import { Button, clsx, Icon, Select } from '@a-type/ui';
import { useState } from 'react';

export interface SearchButtonProps {
	prompt: string;
	provider?: keyof typeof searchConfigs;
	className?: string;
}

const searchConfigs = {
	google: {
		name: 'Google',
		template: 'https://www.google.com/search?q=$1',
	},
	amazon: {
		name: 'Amazon',
		template: 'https://www.amazon.com/s?k=$1',
	},
	ebay: {
		name: 'Ebay',
		template: 'https://www.ebay.com/sch/i.html?_nkw=$1',
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

export function SearchButton({
	prompt,
	provider,
	className,
}: SearchButtonProps) {
	const [selectedProvider, setSelectedProvider] =
		useState<keyof typeof searchConfigs>('amazon');
	const finalProvider = provider || selectedProvider;

	return (
		<div className={clsx('flex flex-row', className)}>
			<Button
				className={clsx('relative z-1', !provider && 'rounded-r-none')}
				size="small"
				render={
					<a
						href={searchConfigs[finalProvider].template.replace('$1', prompt)}
						target="_blank"
						rel="noopener noreferrer"
					/>
				}
			>
				<Icon name="search" />
				{searchConfigs[finalProvider].name}
			</Button>
			{!provider && (
				<Select
					value={selectedProvider}
					onValueChange={(v) => (v ? setSelectedProvider(v) : void 0)}
				>
					<Select.Trigger
						className="rounded-l-none border-l-none !gap-0"
						size="small"
					>
						<Select.Value>{null}</Select.Value>
						<Select.Icon />
					</Select.Trigger>
					<Select.Content>
						{Object.entries(searchConfigs).map(([key, { name }]) => (
							<Select.Item key={key} value={key}>
								{name}
							</Select.Item>
						))}
					</Select.Content>
				</Select>
			)}
		</div>
	);
}
