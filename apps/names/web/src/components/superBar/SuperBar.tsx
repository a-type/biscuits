import { Button, clsx, Icon, Input, withClassName } from '@a-type/ui';
import { CSSProperties, useRef } from 'react';
import { useSuperBar } from './SuperBarContext.jsx';
import { SuperBarCreate } from './SuperBarCreate.jsx';

export interface SuperBarProps {
	className?: string;
}

export function SuperBar({ className }: SuperBarProps) {
	const { inputValue, setInputValue, createNew } = useSuperBar();
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<BottomContainer className={className}>
			<SuperBarCreate />
			<div className="relative w-full p-sm">
				<Input
					ref={inputRef}
					className={clsx('w-full', !!inputValue ? 'pr-[32px]' : undefined)}
					// makes focus ring, which is normally accent, use primary color
					style={{ '--p-accent-hue': 'var(--p-primary-hue)' } as CSSProperties}
					placeholder="Search or add..."
					value={inputValue}
					onValueChange={setInputValue}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							createNew();
						}
					}}
				/>
				{!!inputValue && (
					<Button
						size="small"
						emphasis="ghost"
						className="absolute right-[-4px] top-[55%] translate--1/2"
						onClick={() => {
							setInputValue('');
							inputRef.current?.focus();
						}}
					>
						<Icon name="x" />
					</Button>
				)}
			</div>
		</BottomContainer>
	);
}

const BottomContainer = withClassName(
	'div',
	'fixed bottom-0 left-1/2 translate-x--1/2 z-[var(--z-now-playing)] md:max-w-512px',
	'flex flex-col items-stretch justify-center overflow-hidden bg-primary-wash',
	'border-gray border-solid border-1 lt-sm:(border-b-0 border-l-0 border-r-0) rounded-t-md',
	'pb-[var(--nav-height,env(safe-area-inset-bottom,0px))]',
	'shadow-md w-full overflow-hidden animate-pop-up animate-duration-200',
);
