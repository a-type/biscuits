import { TabsRoot, TabsTrigger } from '@a-type/ui';
import { Link } from '@biscuits/client';
import { useLocation } from '@tanstack/react-router';
import { ComponentPropsWithoutRef } from 'react';

export const NavigationTabsRoot = (
	props: ComponentPropsWithoutRef<typeof TabsRoot>,
) => {
	const location = useLocation();

	return <TabsRoot {...props} value={location.pathname} />;
};

export const NavigationTab = ({
	children,
	...props
}: ComponentPropsWithoutRef<typeof TabsTrigger>) => {
	return (
		<TabsTrigger {...props} render={<Link to={props.value} />}>
			{children}
		</TabsTrigger>
	);
};
