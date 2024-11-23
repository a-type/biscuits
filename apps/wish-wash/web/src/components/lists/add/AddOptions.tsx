import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { withClassName } from '@a-type/ui/hooks';
import {
	typeDescriptions,
	typeIcons,
	typeNames,
	typeThemes,
} from '@wish-wash.biscuits/common';
import { useAddItem } from './AddProvider.jsx';
import { Card } from '@a-type/ui/components/card';

export interface AddOptionsProps {}

export function AddOptions() {
	const { options, getItemProps, highlightedIndex, inputValue } = useAddItem();

	if (!inputValue) {
		return <div>Type something to get started</div>;
	}

	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
			{options.map((option, i) => (
				<Card key={option} className={typeThemes[option]}>
					<Card.Main
						{...getItemProps({ item: option })}
						visuallyFocused={highlightedIndex === i}
					>
						<Card.Title className="flex-row items-center gap-2">
							<Icon name={typeIcons[option]} />
							{typeNames[option]}
						</Card.Title>
						<Card.Content>{typeDescriptions[option]}</Card.Content>
					</Card.Main>
				</Card>
			))}
		</div>
	);
}

const ItemButton = withClassName(
	Button,
	'rounded-lg [flex:1_0_0] min-w-80px aspect-square flex-col p-6 items-center justify-center [--bg:var(--color-primary-wash)]',
	'font-light',
);

const ItemIcon = withClassName(Icon, 'w-1/2 h-1/2 flex-1 stroke-width-0.3');
