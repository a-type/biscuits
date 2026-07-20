import { useMe, Link } from '@biscuits/client';
import { Avatar, Box, Button, clsx, Icon } from '@a-type/ui';

export interface UserMenuProps {
	className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
	const { data } = useMe();

	if (!data?.me) {
		return (
			<Link to="/login">
				<Button size="small" emphasis="primary" className={className}>
					Join the club
				</Button>
			</Link>
		);
	}

	const name = data.me.name;

	return (
		<Box gap="lg" items="center" justify="between" className={clsx(className)}>
			<Box gap items="center">
				<Avatar imageSrc={data.me.imageUrl} name={name} />
				<div>Hi, {name}!</div>
			</Box>
			<Button render={<Link to="/settings" />} emphasis="default">
				Your plan
				<Icon name="gear" />
			</Button>
		</Box>
	);
}
