import { Button } from '@a-type/ui';
import { AppId, appsById, getAppUrl } from '@biscuits/apps';
import classNames from 'classnames';
import PhoneDemo from './PhoneDemo.jsx';

export interface AppDemoProps {
	appId: AppId;
	index: number;
}

export function AppDemo({ appId, index }: AppDemoProps) {
	const app = appsById[appId];

	const url = getAppUrl(app);

	return (
		<div
			className={classNames(
				'flex gap-8 items-center flex-col',
				index % 2 === 1 ? 'sm:flex-row-reverse' : 'sm:flex-row',
			)}
		>
			<div
				className={classNames(
					'flex-shrink-0 sm:w-1/2 items-center grid gap-4 justify-items-start',
					'[grid-template-areas:"icon_title""icon_description""icon_button"]',
					'sm:[grid-template-areas:"icon""title""description""button"]',
					index % 2 === 1 ?
						'sm:justify-items-start'
					:	'sm:(justify-items-end text-end)',
				)}
			>
				<img
					src={`${url}/${app.iconPath}`}
					alt={app.name}
					className="h-auto rounded-lg w-[120px] h-[120px] object-contain object-center"
					style={{ gridArea: 'icon' }}
				/>
				<h3 className="text-2xl font-bold m-0" style={{ gridArea: 'title' }}>
					{app.name}
				</h3>
				<p className="text-lg m-0" style={{ gridArea: 'description' }}>
					{app.description}
				</p>
				<Button asChild style={{ gridArea: 'button' }}>
					<a href={url} target="_blank" rel="noopener noreferrer">
						Open app
					</a>
				</Button>
			</div>
			<div className="flex flex-col gap-2">
				<PhoneDemo
					src={app.demoVideoSrc}
					direction={index % 2 === 0 ? 'left' : 'right'}
				/>
			</div>
		</div>
	);
}
