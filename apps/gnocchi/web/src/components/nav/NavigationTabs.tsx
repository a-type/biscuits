import { TabsRoot, TabsTrigger } from '@a-type/ui';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentPropsWithoutRef } from 'react';

export const NavigationTabsRoot = (
	props: ComponentPropsWithoutRef<typeof TabsRoot>,
) => {
	const path = useLocation().pathname;

	return <TabsRoot {...props} value={path} />;
};

export const NavigationTab = (
	props: ComponentPropsWithoutRef<typeof TabsTrigger>,
) => {
	return <TabsTrigger render={<Link to={props.value} />} {...props} />;
};
