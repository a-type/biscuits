import { Icon } from '@a-type/ui';
import { LinkButton, LinkButtonProps } from '@biscuits/client';
import { forwardRef } from 'react';

export interface OpenFoodDetailButtonProps extends LinkButtonProps {
	foodName: string;
}

export const OpenFoodDetailButton = forwardRef<
	HTMLAnchorElement,
	OpenFoodDetailButtonProps
>(function OpenFoodDetailButton(
	{ foodName, emphasis, children, ...rest },
	ref,
) {
	return (
		<LinkButton
			ref={ref}
			emphasis={!children && emphasis === undefined ? 'ghost' : emphasis}
			to="."
			search={{ showFood: foodName }}
			viewTransition={false}
			{...rest}
		>
			{children || <Icon name="food" />}
		</LinkButton>
	);
});
