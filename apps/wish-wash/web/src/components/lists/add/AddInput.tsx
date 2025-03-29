import { clsx, Input } from '@a-type/ui';
import { forwardRef, useEffect, useRef } from 'react';
import { useAddItem } from './AddProvider.jsx';

export interface AddInputProps {
	className?: string;
	autoFocus?: boolean;
}

export const AddInput = forwardRef<HTMLDivElement, AddInputProps>(
	function AddInput({ className, autoFocus }, ref) {
		const { setInputValue, getInputProps } = useAddItem();
		const inputRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
			if (autoFocus) {
				inputRef.current?.focus();
			}
		}, [autoFocus]);

		return (
			<div ref={ref} className={clsx('flex flex-col gap-1', className)}>
				<label htmlFor="add-item" className="font-bold ml-3">
					Add to this list
				</label>
				<Input
					className="w-full"
					onChange={(e) => setInputValue(e.target.value)}
					{...getInputProps({
						id: 'add-item',
						autoFocus,
						ref: inputRef,
						placeholders,
					})}
				/>
			</div>
		);
	},
);

const placeholders = [
	'Dark green shirts',
	'Anything with cats',
	'Complicated board games',
	'Books about space',
	'Painting supplies',
	'Dark chocolate',
	'Fancy pens',
];
