import {
	Button,
	ButtonProps,
	clsx,
	Icon,
	Input,
	InputProps,
	useParticles,
} from '@a-type/ui';
import { useMergedRef } from '@biscuits/client';
import { forwardRef, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { groceriesState } from '../groceries/state.js';

export interface AddInputProps {
	inputProps: InputProps;
	isOpen: boolean;
	className?: string;
	clear: () => void;
	disableInteraction?: boolean;
	submitButtonProps: ButtonProps;
	onFocus?: () => void;
}

export const AddInput = forwardRef<HTMLDivElement, AddInputProps>(
	function AddInput(
		{
			inputProps,
			submitButtonProps,
			isOpen,
			className,
			clear,
			disableInteraction,
			onFocus,
			...rest
		},
		ref,
	) {
		const inputValue = inputProps.value?.toString() ?? '';
		const inputIsUrl = URL.canParse(inputValue);

		return (
			<Input
				{...rest}
				borderRef={ref}
				data-state={isOpen ? 'open' : 'closed'}
				data-test="grocery-list-add-input"
				name="text"
				required
				className={clsx('max-w-none w-full', className)}
				autoComplete="off"
				tabIndex={disableInteraction ? -1 : 0}
				endAccessory={
					<div className="flex flex-row-reverse gap-1">
						<SubmitButton
							{...submitButtonProps}
							disableInteraction={disableInteraction}
							inputIsUrl={inputIsUrl}
						/>
						{!!inputValue && (
							<Button
								emphasis="ghost"
								onClick={clear}
								aria-label="clear input"
								tabIndex={disableInteraction ? -1 : 0}
							>
								<Icon name="x" />
							</Button>
						)}
					</div>
				}
				{...inputProps}
			/>
		);
	},
);

function SubmitButton({
	children,
	inputIsUrl,
	disableInteraction,
	ref: outerRef,
	...rest
}: ButtonProps & {
	inputIsUrl?: boolean;
	disableInteraction?: boolean;
	ref?: React.Ref<HTMLButtonElement>;
}) {
	const { justAddedSomething } = useSnapshot(groceriesState);

	const innerRef = useRef<HTMLButtonElement>(null);
	const ref = useMergedRef(outerRef, innerRef);

	const particles = useParticles();
	useEffect(() => {
		if (justAddedSomething) {
			if (innerRef.current) {
				particles?.addParticles(
					particles.elementExplosion({
						element: innerRef.current,
						count: 20,
					}),
				);
			}
		}
	}, [justAddedSomething, particles]);

	return (
		<Button
			data-test="grocery-list-add-button"
			emphasis="primary"
			className="relative z-2 items-center justify-center md:(h-35px w-35px p-0)"
			aria-label={inputIsUrl ? 'scan recipe page' : 'add item'}
			tabIndex={disableInteraction ? -1 : 0}
			{...rest}
			ref={ref}
		>
			{inputIsUrl ? <Icon name="scan" /> : <Icon name="plus" />}
		</Button>
	);
}
