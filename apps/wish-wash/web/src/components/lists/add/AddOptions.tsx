import { Card, Icon } from '@a-type/ui';
import {
	typeDescriptions,
	typeIcons,
	typeNames,
	typeThemes,
} from '@wish-wash.biscuits/common';
import { useAddItem } from './AddProvider.jsx';

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
