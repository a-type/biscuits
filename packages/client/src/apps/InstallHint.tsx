import {
	Button,
	clsx,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	H2,
	Icon,
	P,
	withClassName,
} from '@a-type/ui';
import { appsById } from '@biscuits/apps';
import { useSnapshot } from 'valtio';
import { useAppId } from '../common/Context.js';
import { useLocalStorage } from '../hooks/useStorage.js';
import { installState, triggerInstall } from '../install.js';
import {
	getIsEdge,
	getIsFirefox,
	getIsPWAInstalled,
	getIsSafari,
	getOS,
} from '../platform.js';

export interface InstallHintProps {
	content: string;
	className?: string;
}

export function InstallHint({
	content: contentStr,
	className,
}: InstallHintProps) {
	const [isDismissed, setIsDismissed] = useLocalStorage(
		'pwa-install-hint-dismissed',
		false,
	);

	const { installReady } = useSnapshot(installState);

	if (isDismissed || getIsPWAInstalled()) {
		return null;
	}

	const os = getOS();
	const isMobile = os === 'iOS' || os === 'Android';

	if (!isMobile) {
		return null; // TODO: desktop tutorial
	}

	const Content = (isMobile && content[os]) || (() => null);

	return (
		<div
			className={clsx(
				'bg-primaryWash rounded-lg p-4 flex flex-col gap-4 items-stretch',
				className,
			)}
		>
			<P>{contentStr}</P>
			<div className="flex flex-row items-center justify-end gap-4 w-full">
				<Button color="ghost" onClick={() => setIsDismissed(true)}>
					Dismiss
				</Button>
				{installReady ?
					<Button color="primary" onClick={triggerInstall}>
						<Icon name="arrowDown" />
						<span>Install</span>
					</Button>
				:	<Dialog>
						<DialogTrigger asChild>
							<Button color="primary">Learn how</Button>
						</DialogTrigger>
						<DialogContent>
							<Content />
							<DialogActions>
								<DialogClose asChild>
									<Button color="default">Close</Button>
								</DialogClose>
							</DialogActions>
						</DialogContent>
					</Dialog>
				}
			</div>
		</div>
	);
}

const Keyword = withClassName('span', 'color-black bg-primaryWash');
const Video = withClassName('video', 'max-h-60dvh');

function IOSTutorial() {
	const isSafari = getIsSafari();
	const appId = useAppId();
	const app = appsById[appId];

	if (isSafari) {
		return (
			<div>
				<H2>Adding {app.name} to your homescreen</H2>
				<ol>
					<li className="mb-4">
						Open the <IOSShareIcon />
						<Keyword>share menu</Keyword> at the bottom of the screen.
					</li>
					<li>
						Tap <Keyword>"Add to Home Screen"</Keyword>.
					</li>
				</ol>
				<P>
					After you've done this, you can open {app.name} just like any other
					app.
				</P>
				<P>
					Unfortunately, the way this works on iOS, your data will start from
					scratch. If you have a subscription, you can sign back in to re-sync
					your data.
				</P>
			</div>
		);
	}

	return (
		<div>
			<H2>Hi, iOS user!</H2>
			<P>
				{app.name} is a website that can act just like a native app, but Apple
				makes it a little tricky to install.
			</P>
			<P>
				<Keyword>First, you have to open this website in Safari.</Keyword> Once
				you've done that, open Settings and click this button again to show next
				steps.
			</P>
		</div>
	);
}

function IOSShareIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="10 5 40 40"
			enableBackground="new 0 0 50 50"
			width="24"
			height="24"
			stroke="currentColor"
		>
			<path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z" />
			<path d="M24 7h2v21h-2z" />
			<path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z" />
		</svg>
	);
}

function AndroidTutorial() {
	const videoSrc =
		getIsFirefox() ? `/videos/firefox-install.mp4`
		: getIsEdge() ? `/videos/edge-install.mp4`
		: `/videos/android-install.mp4`;

	const appId = useAppId();
	const app = appsById[appId];

	return (
		<div>
			<H2>Adding the {app.name} app to your phone</H2>
			<P>
				Open the browser menu and look for <Keyword>"Install app"</Keyword>
			</P>
			<P>
				After you've done this, you can open {app.name} just like any other app.
				All your data will still be there!
			</P>
			<Video src={videoSrc} controls autoPlay loop />
		</div>
	);
}

const content = {
	iOS: IOSTutorial,
	Android: AndroidTutorial,
};
