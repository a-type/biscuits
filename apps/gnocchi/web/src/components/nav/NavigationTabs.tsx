import { TabsRoot, TabsTrigger } from '@a-type/ui';
import { Link, useOnLocationChange } from '@verdant-web/react-router';
import { ComponentPropsWithoutRef, useState } from 'react';

export const NavigationTabsRoot = (
	props: ComponentPropsWithoutRef<typeof TabsRoot>,
) => {
	const [path, setPath] = useState(() => window.location.pathname);
	useOnLocationChange(() => setPath(window.location.pathname));

	return <TabsRoot {...props} value={path} />;
};

export const NavigationTab = (
	props: ComponentPropsWithoutRef<typeof TabsTrigger>,
) => {
	return <TabsTrigger render={<Link to={props.value} />} {...props} />;
};
