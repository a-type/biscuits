import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { PantryListItemSkeleton } from '@/components/pantry/items/PantryListItem.jsx';
import { pantryOnboarding } from '@/onboarding/pantryOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { Box, CardGrid } from '@a-type/ui';
import { OnboardingBanner } from '@biscuits/client';
import { Suspense } from 'react';
import { ExpiresSoonSection } from './ExpiresSoonSection.jsx';
import cls from './PantryList.module.css';
import { PantryListCategory } from './PantryListCategory.jsx';
import { PantryListSectionTabs } from './PantryListSectionTabs.jsx';

export interface PantryListProps {
	className?: string;
}

function PantryListInner({ className, ...rest }: PantryListProps) {
	const categories = hooks.useAllCategories({
		index: {
			where: 'sortKey',
			order: 'asc',
		},
	});

	return (
		<Box full="width" col items="stretch" {...rest}>
			<OnboardingBanner
				onboarding={pantryOnboarding}
				step="expirations"
				className={cls.onboardingBanner}
			>
				You can add expiration dates to foods to get notified when they&apos;re
				about to expire. Tap any food to get started.
			</OnboardingBanner>
			<Suspense>
				<ExpiresSoonSection />
			</Suspense>
			<Box p col items="center" style={{ minWidth: 0 }}>
				<PantryListSectionTabs />
			</Box>
			<Box col>
				{categories.map((category) => {
					return (
						<PantryListCategory key={category.get('id')} category={category} />
					);
				})}
				<PantryListCategory category={null} />
			</Box>
			<AutoRestoreScroll id="pantryList" />
		</Box>
	);
}

export function PantryList(props: PantryListProps) {
	return (
		<Suspense fallback={<SkeletonList />}>
			<PantryListInner {...props} />
		</Suspense>
	);
}

function SkeletonList() {
	return (
		<Box col items="stretch">
			<Box style={{ height: 30 }} />
			<CardGrid className={cls.grid}>
				{new Array(8).fill(null).map((_, i) => (
					<PantryListItemSkeleton key={i} />
				))}
			</CardGrid>
		</Box>
	);
}
