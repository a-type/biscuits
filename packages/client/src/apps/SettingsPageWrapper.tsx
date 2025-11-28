import {
	Box,
	Button,
	clsx,
	ColorModeToggle,
	Divider,
	H1,
	H2,
	Icon,
} from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { ReactNode } from 'react';
import { BugButton } from '../common/BugButton.js';
import {
	ChangelogDisplay,
	LoginButton,
	LogoutButton,
	ManagePlanButton,
	PromoteSubscriptionButton,
	ReloadButton,
	useHasServerAccess,
	usePageTitle,
} from '../react.js';
import { InstallHint } from './InstallHint.js';
import { ManageStorage } from './storage.js';
import { UpdatePrompt } from './UpdatePrompt.js';
import { usePollForUpdates } from './updateState.js';

export interface SettingsPageWrapperProps {
	className?: string;
	children?: ReactNode;
	installPitch?: string;
}

export function SettingsPageWrapper({
	className,
	children,
	installPitch,
}: SettingsPageWrapperProps) {
	usePollForUpdates(10_000);
	usePageTitle('Settings');
	const subscribed = useHasServerAccess();

	return (
		<Box col p gap items="start" className={clsx('mt-lg', className)}>
			<Box gap items="center">
				<Button
					asChild
					emphasis="ghost"
					aria-label="Back to home"
					className="sticky top-sm"
				>
					<Link to="/">
						<Icon name="arrowLeft" />
					</Link>
				</Button>
				<H1>Settings</H1>
			</Box>
			<InstallHint content={installPitch || 'Install the app'} />
			<UpdatePrompt />
			<ColorModeToggle />
			<LogoutButton />
			{!subscribed ?
				<Box surface color="accent" p>
					<Box gap items="center">
						<PromoteSubscriptionButton emphasis="primary">
							Upgrade your plan
						</PromoteSubscriptionButton>
						<LoginButton emphasis="default" returnTo="/">
							<Icon name="arrowRight" />
							<span>Sign in</span>
						</LoginButton>
					</Box>
					<div>
						Sync devices, collaborate with others, and more with a Biscuits
						subscription.
					</div>
				</Box>
			:	<ManagePlanButton />}
			<Divider />
			{children}
			{children && <Divider />}
			<H2>Troubleshoot</H2>
			<ManageStorage />
			<Box gap>
				<BugButton />
				<ReloadButton />
			</Box>
			<Divider />
			<ChangelogDisplay>
				<Button>
					<Icon name="gift" />
					<span>What's new</span>
				</Button>
			</ChangelogDisplay>
			<Link className="font-bold" to="https://biscuits.club/privacy-policy">
				Privacy policy
			</Link>
			<Link className="font-bold" to="https://biscuits.club/tos">
				Terms and conditions of use
			</Link>
		</Box>
	);
}
