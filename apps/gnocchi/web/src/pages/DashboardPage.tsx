import { DashboardExpiresSoon } from '@/components/dashboard/DashboardExpiresSoon.jsx';
import { DashboardFoods } from '@/components/dashboard/DashboardFoods.jsx';
import { DashboardFreezer } from '@/components/dashboard/DashboardFreezer.jsx';
import { DashboardPinnedRecipes } from '@/components/dashboard/DashboardPinnedRecipes.jsx';
import { Box } from '@a-type/ui';
import { AppIcon } from '@biscuits/client/apps';
import { useLayoutEffect } from 'react';

const DashboardPage = () => {
	useLayoutEffect(() => {
		document.body.style.overflow = 'hidden';
	});
	return (
		<Box
			full
			gap
			p="md"
			items="stretch"
			justify="stretch"
			className="min-h-0 max-h-100vh"
		>
			<Box gap d="col" className="flex-1">
				<Box gap items="center" className="flex-0-0-auto">
					<AppIcon className="w-18px" />
					<h1 className="m-0 p-0 font-fancy font-semibold text-sm">Gnocchi</h1>
				</Box>
				<DashboardPinnedRecipes className="flex-[1_1_auto] overflow-hidden" />
				<DashboardExpiresSoon className="flex-[1_1_auto] overflow-hidden" />
			</Box>
			<div className="flex-[0-0-1px] w-1px h-full bg-gray" />
			<Box gap d="col" className="flex-[2_0_0%]">
				<DashboardFoods className="flex-[1_1_auto] overflow-hidden" />
				<DashboardFreezer className="flex-[1_1_auto] overflow-hidden" />
			</Box>
		</Box>
	);
};

export default DashboardPage;
