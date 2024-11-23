import { Input } from '@a-type/ui/components/input/Input';
import { useAddItem } from './AddProvider.jsx';
import { forwardRef, useEffect, useState } from 'react';
import { clsx } from '@a-type/ui';

export interface AddInputProps {
	className?: string;
}

export const AddInput = forwardRef<HTMLDivElement, AddInputProps>(
	function AddInput({ className }, ref) {
		const { setInputValue, getInputProps } = useAddItem();

		const [placeholderIndex, setPlaceholderIndex] = useState(() =>
			Math.floor(Math.random() * placeholders.length),
		);
		useEffect(() => {
			const interval = setInterval(() => {
				setPlaceholderIndex(Math.floor(Math.random() * placeholders.length));
			}, 5000);
			return () => clearInterval(interval);
		}, []);

		const placeholder = placeholders[placeholderIndex];

		return (
			<div ref={ref} className={clsx('flex flex-col gap-1', className)}>
				<label htmlFor="add-item" className="font-bold ml-3">
					Add to this list
				</label>
				<Input
					onChange={(e) => setInputValue(e.target.value)}
					{...getInputProps({
						placeholder,
						id: 'add-item',
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
