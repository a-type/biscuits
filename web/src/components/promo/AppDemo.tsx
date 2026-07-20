import { Box, Button, clsx, Icon } from '@a-type/ui';
import { AppId, appsById, getAppUrl, visibleApps } from '@biscuits/apps';
import {
	animated,
	config,
	useSpringRef,
	useTransition,
} from '@react-spring/web';
import { useSearchParams } from '@biscuits/client';
import { useEffect } from 'react';
import classes from './AppDemo.module.css';
import PhoneDemo from './PhoneDemo.jsx';

const AImg = animated('img');
const AH3 = animated('h3');
const AP = animated('p');

export interface AppDemoProps {
	className?: string;
}

export function AppDemo({ className }: AppDemoProps) {
	const [search, updateSearch] = useSearchParams();
	const appId = (search.get('appId') ?? 'gnocchi') as AppId;
	const setAppId = (appId: AppId) =>
		updateSearch((s) => {
			s.set('appId', appId);
			return s;
		});

	const app = appsById[appId];
	const appIndex = visibleApps.findIndex((v) => v.id === appId);

	const url = getAppUrl(app);

	const transRef = useSpringRef();
	const transitions = useTransition(appIndex, {
		ref: transRef,
		keys: null,
		from: { opacity: 0, transform: 'translate3d(100%, 0, 0)' },
		enter: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
		leave: { opacity: 0, transform: 'translate3d(-50%, 0, 0)' },
		config: config.gentle,
	});

	useEffect(() => {
		transRef.start();
	}, [appId, transRef]);

	return (
		<div className={clsx(className, `@mode-${app.theme}`, classes.info)}>
			<div className={classes.details}>
				{transitions((style, i) => {
					const app = visibleApps[i];
					return (
						<>
							<AImg
								src={`${app.url}/${app.iconPath}`}
								alt={app.name}
								className={classes.appIcon}
								style={{ gridArea: 'icon', ...style }}
							/>
							<AH3
								className={classes.appName}
								style={{ gridArea: 'title', ...style }}
							>
								{app.name}
							</AH3>
							<AP
								className={classes.appDescription}
								style={{ gridArea: 'description', ...style }}
							>
								{app.description}
							</AP>
							<Button
								emphasis="primary"
								className={classes.openButton}
								render={
									<a href={url} target="_blank" rel="noopener noreferrer" />
								}
								style={{ gridArea: 'button' }}
							>
								Open app
								<Icon name="new_window" />
							</Button>
						</>
					);
				})}
				<div className={classes.phoneDemoWrap}>
					<PhoneDemo src={app.demoVideoSrc} direction={'left'} />
				</div>
			</div>
			<Box
				wrap
				gap="md"
				items="center"
				className={classes.sidebar}
				justify="center"
			>
				{visibleApps.map((app) => (
					<Button
						emphasis="ghost"
						onClick={() => setAppId(app.id)}
						key={app.id}
						toggled={app.id === appId}
						toggleMode="state-only"
						className={clsx(
							classes.appButton,
							appId === app.id ? classes.appButtonActive : '',
						)}
					>
						<img
							src={`${app.url}/${app.iconPath}`}
							alt={app.name}
							className={classes.pickerIcon}
						/>
					</Button>
				))}
			</Box>
		</div>
	);
}
