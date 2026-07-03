import { Button, clsx, Icon, Input, withClassName } from '@a-type/ui';
import { useRef } from 'react';
import cls from './SuperBar.module.css';
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
			<div className={cls.inputWrap}>
				<Input
					ref={inputRef}
					className={clsx(cls.input, !!inputValue ? cls.inputEmpty : undefined)}
					placeholder="Search or add..."
					value={inputValue}
					onValueChange={setInputValue}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							createNew();
						}
					}}
					endAccessory={
						!!inputValue && (
							<Button
								size="small"
								emphasis="ghost"
								className={cls.clearButton}
								onClick={() => {
									setInputValue('');
									inputRef.current?.focus();
								}}
							>
								<Icon name="x" />
							</Button>
						)
					}
				/>
			</div>
		</BottomContainer>
	);
}

const BottomContainer = withClassName('div', cls.container);
