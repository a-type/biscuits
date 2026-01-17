import { Box, Button, clsx, Icon } from '@a-type/ui';
import { AppId, appsById, getAppUrl, visibleApps } from '@biscuits/apps';
import {
	animated,
	config,
	useSpringRef,
	useTransition,
} from '@react-spring/web';
import { useSearchParams } from '@verdant-web/react-router';
import classNames from 'classnames';
import { useEffect } from 'react';
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
		<Box
			d={{ default: 'col-reverse', md: 'row' }}
			gap="md"
			items="stretch"
			justify="center"
			className={clsx(className, `theme-${app.theme}`)}
		>
			<div
				className={classNames(
					'flex flex-1 flex-col-reverse items-center gap-8 p-md',
					'sm:flex-row',
				)}
			>
				<div
					className={classNames(
						'grid w-full flex-shrink-0 items-center justify-items-start gap-4 sm:w-1/2',
						'[grid-template-areas:"icon_title""icon_description""icon_button"]',
						'[grid-template-columns:auto_1fr]',
						'sm:[grid-template-areas:"icon""title""description""button"]',
						'sm:([grid-template-columns:auto] justify-items-end text-end)',
					)}
				>
					{transitions((style, i) => {
						const app = visibleApps[i];
						return (
							<>
								<AImg
									src={`${app.url}/${visibleApps[i].iconPath}`}
									alt={app.name}
									className="h-[120px] h-auto w-[120px] rounded-lg object-contain object-center"
									style={{ gridArea: 'icon', ...style }}
								/>
								<AH3
									className="m-0 text-2xl font-bold"
									style={{ gridArea: 'title', ...style }}
								>
									{app.name}
								</AH3>
								<AP
									className="m-0 h-80px text-lg"
									style={{ gridArea: 'description', ...style }}
								>
									{app.description}
								</AP>
								<Button
									emphasis="primary"
									className="self-center justify-self-start sm:justify-self-end"
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
				</div>
				<div className="flex flex-col gap-2">
					<PhoneDemo src={app.demoVideoSrc} direction={'left'} />
				</div>
			</div>
			<Box
				d={{ default: 'row', md: 'col' }}
				wrap
				gap="md"
				items="center"
				className="w-full md:(h-full w-auto flex-0-0-auto)"
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
							'rounded-sm',
							appId === app.id ? 'bg-primary-light' : '',
						)}
					>
						<img
							src={`${app.url}/${app.iconPath}`}
							alt={app.name}
							className="h-60px w-60px"
						/>
					</Button>
				))}
			</Box>
		</Box>
	);
}
