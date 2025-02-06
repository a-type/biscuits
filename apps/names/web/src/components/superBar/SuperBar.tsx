import { Button, clsx, Icon, Input } from '@a-type/ui';
import { useRef } from 'react';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarProps {
	className?: string;
}

export function SuperBar({ className }: SuperBarProps) {
	const { inputValue, setInputValue, createNew } = useSuperBar();
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className={clsx('relative', className)}>
			<Input
				ref={inputRef}
				className={clsx('w-full', !!inputValue ? 'pr-[32px]' : undefined)}
				placeholder="Search or add..."
				autoFocus
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
					size="icon-small"
					color="ghost"
					className="absolute right-[-12px] top-[55%] translate--1/2"
					onClick={() => {
						setInputValue('');
						inputRef.current?.focus();
					}}
				>
					<Icon name="x" />
				</Button>
			)}
		</div>
	);
}
