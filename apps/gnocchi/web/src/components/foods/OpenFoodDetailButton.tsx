import { Button, ButtonProps, Icon } from '@a-type/ui';
import { useSearchParams } from '@verdant-web/react-router';
import { forwardRef } from 'react';

export type OpenFoodDetailButtonProps = ButtonProps & {
	foodName: string;
};

export const OpenFoodDetailButton = forwardRef<
	HTMLButtonElement,
	OpenFoodDetailButtonProps
>(function OpenFoodDetailButton(
	{ foodName, emphasis, children, ...rest },
	ref,
) {
	const [_, setParams] = useSearchParams();
	const openDialog = () => {
		setParams(
			(old) => {
				old.set('showFood', foodName);
				return old;
			},
			{ state: { noUpdate: true } },
		);
	};

	return (
		<Button
			ref={ref}
			onClick={openDialog}
			emphasis={!children && emphasis === undefined ? 'ghost' : emphasis}
			{...rest}
		>
			{children || <Icon name="food" />}
		</Button>
	);
});
