import { Button, ButtonProps } from '@a-type/ui';

export interface BugButtonProps extends ButtonProps {}

export function BugButton(props: BugButtonProps) {
	return (
		<a href="mailto:hi@biscuits.club" target="_blank" rel="noopener noreferrer">
			<Button emphasis="default" {...props}>
				Report a bug
			</Button>
		</a>
	);
}
