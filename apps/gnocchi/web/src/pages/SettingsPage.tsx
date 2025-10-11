import { useKeepOpenAfterSelect } from '@/components/addBar/hooks.js';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { ManageCategoriesDialog } from '@/components/menu/ManageCategoriesDialog.jsx';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { TextLink } from '@/components/nav/Link.jsx';
import { ReloadButton } from '@/components/sync/ReloadButton.jsx';
import { useInterval } from '@/hooks/useInterval.js';
import {
	Button,
	Divider,
	H1,
	H2,
	Icon,
	PageContent,
	Switch,
	toast,
} from '@a-type/ui';
import {
	ChangelogDisplay,
	DarkModeToggle,
	LoginButton,
	ManagePlanButton,
	PromoteSubscriptionButton,
	useHasServerAccess,
	useIsLoggedIn,
	useIsOffline,
	useMe,
} from '@biscuits/client';
import {
	InstallHint,
	ManageStorage,
	UpdatePrompt,
	usePollForUpdates,
} from '@biscuits/client/apps';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';

const contents = {
	offline: OfflineContents,
	anonymous: AnonymousContents,
	unsubscribed: UnsubscribedContents,
	online: OnlineContents,
} as const;

export function SettingsPage() {
	const offline = useIsOffline();
	const isLoggedIn = useIsLoggedIn();
	const canSync = useHasServerAccess();

	let state: keyof typeof contents = 'online';
	if (offline) {
		state = 'offline';
	} else if (!isLoggedIn) {
		state = 'anonymous';
	} else if (!canSync) {
		state = 'unsubscribed';
	}

	const Contents = contents[state];

	usePollForUpdates(30000);

	return (
		<PageContent p="none">
			<div className="flex flex-col w-full mt-6 p-4 gap-4 items-start">
				<H1>Settings</H1>
				<UpdatePrompt />
				<Contents />
				<div className="text-xs flex flex-col gap-2">
					<ChangelogDisplay>
						<Button>
							<Icon name="gift" />
							<span>What&apos;s new</span>
						</Button>
					</ChangelogDisplay>
					<TextLink to="/privacy-policy">Privacy policy</TextLink>
					<TextLink to="/tos">Terms and conditions of use</TextLink>
				</div>
			</div>
			<AutoRestoreScroll />
		</PageContent>
	);
}

export default SettingsPage;

const MainContainer = ({ children }: { children: ReactNode }) => (
	<div className="flex flex-col items-start w-full gap-4">{children}</div>
);

function ManageSection() {
	return (
		<>
			<ManageCategories />
			<ManageSettings />
			{/* <ManageFoodsButton /> */}
			<ManageStorage onError={(err) => toast.error(err.message)} />
		</>
	);
}

function OfflineContents() {
	const { refetch } = useMe();

	useInterval(refetch, 3000);

	return (
		<MainContainer>
			<InstallHint content="Always have your list on hand. Install the app!" />
			<DarkModeToggle />
			<Button size="small" color="default" onClick={() => refetch()}>
				Retry connection
			</Button>
			<ManageSection />
			<Divider />
			<BugButton />
			<ReloadButton />
		</MainContainer>
	);
}

function AnonymousContents() {
	return (
		<MainContainer>
			<InstallHint content="Always have your list on hand. Install the app!" />
			<DarkModeToggle />
			<div>
				<div className="flex flex-row items-center gap-2">
					<PromoteSubscriptionButton color="primary">
						Upgrade now
					</PromoteSubscriptionButton>
					<LoginButton color="default" returnTo="/">
						<ArrowRightIcon />
						<span>Sign in</span>
					</LoginButton>
				</div>
				<span className="text-xs">
					Sync devices, collaborate with others, and more
				</span>
			</div>
			<Divider />
			<ManageSection />
			<Divider />
			<BugButton />
			<ReloadButton />
		</MainContainer>
	);
}

function UnsubscribedContents() {
	return (
		<MainContainer>
			<InstallHint content="Always have your list on hand. Install the app!" />
			<DarkModeToggle />
			<ManageSection />
			<Divider />
			<BugButton />
			<ReloadButton />
		</MainContainer>
	);
}

function OnlineContents() {
	return (
		<MainContainer>
			<InstallHint content="Always have your list on hand. Install the app!" />
			<DarkModeToggle />
			{/* <H2>Collaborate</H2> */}
			{/* TODO: re-enable push subscriptions */}
			{/* <PushSubscriptionToggle vapidKey={VAPID_KEY} /> */}
			<Divider />
			<H2>Manage</H2>
			<ManagePlanButton />
			<ManageSection />
			<Divider />
			<H2>Troubleshoot</H2>
			<BugButton />
			<ReloadButton />
			<Divider />
		</MainContainer>
	);
}

function ManageCategories() {
	return (
		<div>
			<ManageCategoriesDialog>
				<Button>Manage categories</Button>
			</ManageCategoriesDialog>
			<span className="text-xs">Add, remove, and rearrange categories</span>
		</div>
	);
}

function ManageSettings() {
	const [addBarKeepOpen, setAddBarKeepOpen] = useKeepOpenAfterSelect();
	return (
		<div className="row">
			<Switch
				id="addbar-keepopen"
				checked={addBarKeepOpen}
				onCheckedChange={setAddBarKeepOpen}
			/>
			<label htmlFor="addbar-keepopen" className="text-sm">
				Keep add bar open after adding items
			</label>
		</div>
	);
}
