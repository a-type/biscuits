import { Box, Card, clsx, Icon } from '@a-type/ui';
import { getAppUrl, visibleApps } from '@biscuits/apps';
import { Link } from '@verdant-web/react-router';

export interface AppGridProps {
	className?: string;
}

export function AppGrid({ className }: AppGridProps) {
	return (
		<Box
			gap="lg"
			className={clsx('grid grid-cols-1 sm:grid-cols-2', className)}
		>
			{visibleApps.map((app) => (
				<Card key={app.id}>
					<Card.Main
						render={<Link to={getAppUrl(app)} />}
						className="grid gap-md grid-areas-[icon_name]-[description_description] grid-cols-[auto_1fr] font-normal items-center p-md group"
					>
						<h3 className="text-lg font-semibold grid-area-[name] m-0">
							{app.name}
						</h3>
						<img
							src={`${app.url}/${app.iconPath}`}
							alt=""
							className="w-16 h-16 grid-area-[icon]"
						/>
						<div className="text-sm text-gray-ink grid-area-[description]">
							{app.description}
						</div>
						<Icon
							name="new_window"
							className="absolute top-md right-md transition-transform [.group:hover>&]:(translate-x-2 -translate-y-2)"
						/>
					</Card.Main>
				</Card>
			))}
		</Box>
	);
}
