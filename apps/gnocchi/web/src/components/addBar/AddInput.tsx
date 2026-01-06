import useMergedRef from '@/hooks/useMergedRef.js';
import {
	Button,
	ButtonProps,
	Icon,
	Input,
	InputProps,
	useParticles,
} from '@a-type/ui';
import classNames from 'classnames';
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
			<div
				data-state={isOpen ? 'open' : 'closed'}
				className={classNames(
					'layer-components:(flex gap-2 flex-row w-full relative)',
					className,
				)}
				{...rest}
				ref={ref}
			>
				<Input
					data-test="grocery-list-add-input"
					name="text"
					required
					className="flex-1 pr-[72px] max-w-none"
					autoComplete="off"
					tabIndex={disableInteraction ? -1 : 0}
					{...inputProps}
				/>
				<div className="absolute flex flex-row-reverse gap-1 right-0px top-0px">
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
			</div>
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
	}, [justAddedSomething]);

	return (
		<Button
			data-test="grocery-list-add-button"
			emphasis="primary"
			className="md:(w-35px h-35px p-0) items-center justify-center relative z-2"
			aria-label={inputIsUrl ? 'scan recipe page' : 'add item'}
			tabIndex={disableInteraction ? -1 : 0}
			{...rest}
			ref={ref}
		>
			{inputIsUrl ? <Icon name="scan" /> : <Icon name="plus" />}
		</Button>
	);
}
