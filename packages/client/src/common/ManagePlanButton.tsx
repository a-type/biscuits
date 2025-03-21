import { Button, ButtonProps } from '@a-type/ui';
import * as CONFIG from '../config.js';
import { useAppId } from './Context.js';

export interface ManagePlanButtonProps extends ButtonProps {}

export function ManagePlanButton({
	children,
	...props
}: ManagePlanButtonProps) {
	const appReferrer = useAppId();
	return (
		<Button asChild {...props}>
			<a href={`${CONFIG.HOME_ORIGIN}/settings?appReferrer=${appReferrer}`}>
				{children || 'Manage plan'}
			</a>
		</Button>
	);
}
