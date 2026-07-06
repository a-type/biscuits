import {
	Box,
	Button,
	clsx,
	ColorModeToggle,
	Divider,
	Heading,
	Icon,
	Text,
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
import cls from './SettingsPageWrapper.module.css';
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
		<Box col p gap items="start" className={clsx(cls.root, className)}>
			<Box gap items="center">
				<Button
					render={<Link to="/" />}
					emphasis="ghost"
					aria-label="Back to home"
					className={cls.back}
				>
					<Icon name="arrowLeft" />
				</Button>
				<Heading render={<h1 />} emphasis="primary">
					Settings
				</Heading>
			</Box>
			<InstallHint content={installPitch || 'Install the app'} />
			<UpdatePrompt />
			<ColorModeToggle />
			{!subscribed ?
				<Box surface col color="accent">
					<Box gap items="center">
						<PromoteSubscriptionButton emphasis="primary">
							Upgrade your plan
						</PromoteSubscriptionButton>
						<LoginButton emphasis="default" returnTo="/">
							<Icon name="arrowRight" />
							<span>Sign in</span>
						</LoginButton>
					</Box>
					<Text emphasis="ambient" dim italic>
						Sync devices, collaborate with others, and more with a Biscuits
						subscription.
					</Text>
				</Box>
			:	<ManagePlanButton />}
			<LogoutButton full="width" emphasis="ghost" color="attention" />
			<Divider />
			{children}
			{children && <Divider />}
			<Heading render={<h2 />} emphasis="secondary">
				Troubleshoot
			</Heading>
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
			<Link className={cls.link} to="https://biscuits.club/privacy-policy">
				Privacy policy
			</Link>
			<Link className={cls.link} to="https://biscuits.club/tos">
				Terms and conditions of use
			</Link>
		</Box>
	);
}
