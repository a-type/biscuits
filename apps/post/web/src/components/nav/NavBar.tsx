import { NavBar as BaseNavBar, Box } from '@a-type/ui';
import { Link, useOnLocationChange } from '@verdant-web/react-router';
import { Suspense, useState } from 'react';
import { NotebooksSubnav } from './NotebooksSubnav.jsx';

export interface NavBarProps {}

export function NavBar({}: NavBarProps) {
	const [path, setPath] = useState(location.pathname);
	useOnLocationChange((location) => setPath(location.pathname));

	return (
		<BaseNavBar>
			<Box className="hidden md:flex self-end" p>
				<h1 className="text-lg font-600 font-fancy m-0 ">Post</h1>
			</Box>
			<BaseNavBar.Item asChild>
				<Link to="/" data-active={path === '/'}>
					<BaseNavBar.ItemIconWrapper>
						<BaseNavBar.ItemIcon name="home" />
					</BaseNavBar.ItemIconWrapper>
					<BaseNavBar.ItemText>Home</BaseNavBar.ItemText>
				</Link>
			</BaseNavBar.Item>
			<BaseNavBar.Item asChild data-active={path.startsWith('/notebooks')}>
				<Link to="/notebooks">
					<BaseNavBar.ItemIconWrapper>
						<BaseNavBar.ItemIcon name="book" />
					</BaseNavBar.ItemIconWrapper>
					<BaseNavBar.ItemText>Notebooks</BaseNavBar.ItemText>
				</Link>
			</BaseNavBar.Item>
			<Suspense fallback={null}>
				<NotebooksSubnav open className="hidden md:flex" />
			</Suspense>
		</BaseNavBar>
	);
}
