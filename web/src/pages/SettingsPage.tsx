import { Footer } from '@/components/help/Footer.jsx';
import { MembersAndInvitations } from '@/components/plan/MembersAndInvitations.jsx';
import { VerdantLibraries } from '@/components/storage/VerdantLibraries.jsx';
import { EmailUpdatesToggle } from '@/components/user/EmailUpdatesToggle.jsx';
import {
	UserInfoEditor,
	userInfoFragment,
} from '@/components/user/UserInfoEditor.jsx';
import {
	Box,
	Button,
	ErrorBoundary,
	H3,
	Icon,
	PageContent,
	PageFixedArea,
	PageRoot,
	Tabs,
} from '@a-type/ui';
import { apps } from '@biscuits/apps';
import { LogoutButton, useLocalStorage } from '@biscuits/client';

import { SubscriptionSetup } from '@biscuits/client/subscription';
import { graphql, NetworkStatus, useQuery } from '@biscuits/graphql';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { Suspense, useEffect } from 'react';
import classes from './SettingsPage.module.css';

const PlanPageData = graphql(
	`
		query PlanPageData {
			me {
				id
				plan {
					id
					subscriptionStatus
					isSubscribed
				}
				...UserInfoEditor_userInfoFragment
			}
		}
	`,
	[userInfoFragment],
);

export interface PlanPageProps {}

export function PlanPage({}: PlanPageProps) {
	const result = useQuery(PlanPageData);
	const { data } = result;
	const navigate = useNavigate();
	const search = useSearch({ strict: false }) as Record<string, string>;
	const returnToAppId = search.appReferrer;
	const returnToApp = apps.find((app) => app.id === returnToAppId) ?? undefined;
	const returnToAppUrl =
		import.meta.env.DEV ? returnToApp?.devOriginOverride : returnToApp?.url;

	const hasAccount = !!result.data?.me;
	const [_, setSeen] = useLocalStorage('seenBefore', false);
	useEffect(() => {
		if (hasAccount) setSeen(true);
	}, [setSeen, hasAccount]);

	const justPaid =
		search.paymentComplete || search.redirect_status === 'succeeded';

	useEffect(() => {
		if (result.networkStatus === NetworkStatus.ready && !hasAccount) {
			const searchStr = window.location.search;
			const path = window.location.pathname;
			navigate({ to: '/login', search: { returnTo: `${path}${searchStr}` } });
		}
	}, [result, navigate, hasAccount]);

	const tab = search.tab ?? 'profile';
	const setTab = (tab: string) => {
		navigate({
			replace: true,
			search: {
				...search,
				tab,
			} as any,
		});
	};

	return (
		<PageRoot>
			<PageContent gap="lg" className={classes.pageContent}>
				<PageFixedArea className={classes.topBar}>
					<Button
						render={<a href={returnToAppUrl ?? '/'} />}
						emphasis="primary"
					>
						<Icon name="arrowLeft" />
						<span>Back to {returnToApp?.name ?? 'apps'}</span>
					</Button>
					<LogoutButton />
				</PageFixedArea>
				<Tabs value={tab} onValueChange={setTab} className={classes.tabsFlex}>
					<Tabs.List>
						<Tabs.Trigger value="profile">Profile</Tabs.Trigger>
						<Tabs.Trigger value="subscription">Subscription</Tabs.Trigger>
						<Tabs.Trigger value="members">Members</Tabs.Trigger>
						<Tabs.Trigger value="data">Data</Tabs.Trigger>
					</Tabs.List>
					<Box gap col className={classes.tabsContent}>
						{justPaid && (
							<Box
								surface="secondary"
								color="success"
								border
								elevated="sm"
								p="sm"
								gap
								items="center"
								className={classes.successBanner}
							>
								<Icon name="suitHeart" /> Thanks for subscribing!
								<Button
									onClick={() => {
										navigate({
											replace: true,
											search: {
												...search,
												paymentComplete: undefined,
												redirect_status: undefined,
											} as any,
										});
									}}
									aria-label="Close notification"
									emphasis="ghost"
									className={classes.successClose}
								>
									<Icon name="x" />
								</Button>
							</Box>
						)}
						<Tabs.Content value="profile">
							<ErrorBoundary>
								<Suspense>
									{data?.me ?
										<UserInfoEditor user={data.me} />
									:	<div>Loading...</div>}
								</Suspense>
							</ErrorBoundary>
							<ErrorBoundary>
								<Suspense>
									<EmailUpdatesToggle
										isSubscribed={data?.me?.plan?.isSubscribed}
									/>
								</Suspense>
							</ErrorBoundary>
						</Tabs.Content>
						<Tabs.Content value="subscription">
							<ErrorBoundary
								fallback={
									<div>
										Something went wrong. Couldn&apos;t load this content.
									</div>
								}
							>
								<Suspense>
									<SubscriptionSetup />
								</Suspense>
							</ErrorBoundary>
						</Tabs.Content>
						<Tabs.Content value="members">
							<ErrorBoundary>
								<Suspense>
									<>
										<Box col gap>
											<H3>Members</H3>
											<MembersAndInvitations />
										</Box>
									</>
								</Suspense>
							</ErrorBoundary>
						</Tabs.Content>
						<Tabs.Content value="data">
							<ErrorBoundary>
								<Suspense>
									<div className={classes.dataTabContent}>
										<H3>App data</H3>
										<VerdantLibraries />
									</div>
								</Suspense>
							</ErrorBoundary>
						</Tabs.Content>
					</Box>
				</Tabs>
				<Footer />
			</PageContent>
		</PageRoot>
	);
}

export default PlanPage;
