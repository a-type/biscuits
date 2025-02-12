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
	}, [appId]);

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
					'flex gap-8 p-md items-center flex-col-reverse flex-1',
					'sm:flex-row',
				)}
			>
				<div
					className={classNames(
						'flex-shrink-0 w-full sm:w-1/2 items-center grid gap-4 justify-items-start',
						'[grid-template-areas:"icon_title""icon_description""icon_button"]',
						'[grid-template-columns:auto_1fr]',
						'sm:[grid-template-areas:"icon""title""description""button"]',
						'sm:(justify-items-end text-end [grid-template-columns:auto])',
					)}
				>
					{transitions((style, i) => {
						const app = visibleApps[i];
						return (
							<>
								<animated.img
									src={`${app.url}/${visibleApps[i].iconPath}`}
									alt={app.name}
									className="h-auto rounded-lg w-[120px] h-[120px] object-contain object-center"
									style={{ gridArea: 'icon', ...style }}
								/>
								<animated.h3
									className="text-2xl font-bold m-0"
									style={{ gridArea: 'title', ...style }}
								>
									{app.name}
								</animated.h3>
								<animated.p
									className="text-lg m-0 h-80px"
									style={{ gridArea: 'description', ...style }}
								>
									{app.description}
								</animated.p>
								<Button
									color="primary"
									className="justify-self-start sm:justify-self-end self-center"
									asChild
									style={{ gridArea: 'button' }}
								>
									<a href={url} target="_blank" rel="noopener noreferrer">
										Open app
										<Icon name="new_window" />
									</a>
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
				className="w-full md:(w-auto h-full flex-0-0-auto)"
				justify="center"
			>
				{visibleApps.map((app) => (
					<Button
						color="ghost"
						size="icon"
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
							className="w-60px h-60px"
						/>
					</Button>
				))}
			</Box>
		</Box>
	);
}
