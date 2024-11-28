import { Button, clsx, Icon } from '@a-type/ui';
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
				<Button color="primary" className={className}>
					Join the club
				</Button>
			</Link>
		);
	}

	const name = data.me.name;

	return (
		<Button asChild color="ghost" className={clsx(className, 'gap-4')}>
			<Link to="/settings">
				<span>Hi, {name}!</span>
				<div className="rounded-full bg-white border-default flex items-center justify-center w-32px h-32px">
					<Icon name="gear" />
				</div>
			</Link>
		</Button>
	);
}
