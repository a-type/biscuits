import { FloatingAdd } from '@/components/groceries/addBar/FloatingAdd.jsx';
import { AddBarSuggestionProvider } from '@/components/groceries/addBar/SuggestionContext.jsx';
import { ListEdit } from '@/components/groceries/lists/ListEdit.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { RecipeSavePrompt } from '@/components/recipes/savePrompt/RecipeSavePrompt.jsx';
import { ListContext } from '@/contexts/ListContext.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import {
	List,
	ListSelectWrapper,
	MainActions,
	ThemedPageContent,
	TopControls,
	UnknownListRedirect,
} from '@/pages/groceries/layout.jsx';
import { Box, PageNowPlaying } from '@a-type/ui';
import { ChangelogDisplay } from '@biscuits/client';
import { InstallButton, UserMenu } from '@biscuits/client/apps';
import { useNavigate, useParams } from '@verdant-web/react-router';
import { Suspense, useCallback, useEffect } from 'react';

export function GroceriesPage() {
	const navigate = useNavigate();

	usePageTitle('Groceries');

	const onListChange = useCallback(
		(listId: string | null | undefined) => {
			if (listId === undefined) {
				navigate('/');
			} else if (listId === null) {
				navigate('/list/null');
			} else {
				navigate(`/list/${listId}`);
			}
		},
		[navigate],
	);
	const { listId: listIdParam } = useParams();
	const listId =
		listIdParam === 'null' || listIdParam === 'all' ? null : listIdParam;

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
					<AutoRestoreScroll />
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
