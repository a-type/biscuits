import { FloatingAdd } from '@/components/groceries/addBar/FloatingAdd.jsx';
import { AddBarSuggestionProvider } from '@/components/groceries/addBar/SuggestionContext.jsx';
import {
	List,
	ListSelectWrapper,
	MainActions,
	ThemedPageContent,
	TopControls,
	UnknownListRedirect,
} from '@/components/groceries/layout.jsx';
import { ListEdit } from '@/components/groceries/lists/ListEdit.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { RecipeSavePrompt } from '@/components/recipes/savePrompt/RecipeSavePrompt.jsx';
import { ListContext } from '@/contexts/ListContext.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import { Box, PageNowPlaying } from '@a-type/ui';
import { ChangelogDisplay } from '@biscuits/client';
import { InstallButton, UserMenu } from '@biscuits/client/apps';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Suspense, useCallback, useEffect } from 'react';

export function GroceriesPage() {
	const navigate = useNavigate();

	usePageTitle('Groceries');

	const onListChange = useCallback(
		(listId: string | null | undefined) => {
			if (listId === undefined) {
				navigate({
					to: '/',
				});
			} else {
				navigate({ to: `/list/$listId`, params: { listId: listId ?? 'null' } });
			}
		},
		[navigate],
	);
	const { listId: listIdParam } =
		useParams({
			from: '/list/$listId',
			shouldThrow: false,
		}) ?? {};
	const listId = listIdParam === 'null' ? null : listIdParam;

	const start = firstTimeOnboarding.useBegin();
	useEffect(() => {
		start();
	}, [start]);

	return (
		<ListContext.Provider value={listId}>
			<AddBarSuggestionProvider>
				<RecipeSavePrompt />
				<ThemedPageContent listId={listId}>
					<TopControls>
						<ListSelectWrapper>
							<ListSelect includeAll value={listId} onChange={onListChange} />
							{listId && <ListEdit listId={listId} />}
						</ListSelectWrapper>

						<Box items="center" gap="sm">
							<Suspense>
								<ChangelogDisplay className="gt-sm" hideOnSeen />
							</Suspense>
							<InstallButton />
							<Suspense>
								<UserMenu />
							</Suspense>
						</Box>
					</TopControls>
					<MainActions />
					<List />
					<UnknownListRedirect listId={listId} />
					<PageNowPlaying
						keepAboveKeyboard
						style={{ pointerEvents: 'none', alignItems: 'center' }}
					>
						<FloatingAdd />
					</PageNowPlaying>
				</ThemedPageContent>
			</AddBarSuggestionProvider>
		</ListContext.Provider>
	);
}
