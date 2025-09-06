import { Avatar, Box, Button, clsx, Icon } from '@a-type/ui';
import { useMe } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';

export interface UserMenuProps {
	className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
	const { data } = useMe();

	if (!data?.me) {
		return (
			<Link to="/login">
				<Button size="small" color="primary" className={className}>
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
			<Button asChild color="default">
				<Link to="/settings">
					Your plan
					<Icon name="gear" />
				</Link>
			</Button>
		</Box>
	);
}
