import { Button, ButtonProps } from '@a-type/ui';
import { showSubscriptionPromotion } from './SubscriptionPromotion.js';

export interface PromoteSubscriptionButtonProps extends ButtonProps {}

export function PromoteSubscriptionButton({
	children,
	...rest
}: PromoteSubscriptionButtonProps) {
	return (
		<Button color="primary" {...rest} onClick={showSubscriptionPromotion}>
			{children}
		</Button>
	);
}
