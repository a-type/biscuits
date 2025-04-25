import { Box, withClassName } from '@a-type/ui';
import { List } from '@wish-wash.biscuits/verdant';
import { AddInput } from './AddInput.jsx';
import { AddOptions } from './AddOptions.jsx';
import { AddOptionsCollapsible } from './AddOptionsCollapsible.jsx';
import { AddItemProvider } from './AddProvider.jsx';

export interface AddItemProps {
	list: List;
	className?: string;
}

export function AddItem({ list, className }: AddItemProps) {
	return (
		<AddItemProvider list={list}>
			<BottomContainer className={className}>
				<Box p d="col" gap="sm">
					<AddOptionsCollapsible>
						<AddOptions />
					</AddOptionsCollapsible>
					<AddInput />
				</Box>
			</BottomContainer>
		</AddItemProvider>
	);
}

const BottomContainer = withClassName(
	'div',
	'fixed bottom-0 left-1/2 translate-x--1/2 z-[var(--z-nowPlaying)] md:max-w-512px',
	'flex flex-col items-stretch justify-center overflow-hidden bg-primary-wash',
	'border-gray border-solid border-1 lt-sm:(border-b-0 border-l-0 border-r-0) rounded-t-md',
	'pb-[var(--nav-height,env(safe-area-inset-bottom,0px))]',
	'shadow-md w-full overflow-hidden animate-pop-up animate-duration-200',
);
