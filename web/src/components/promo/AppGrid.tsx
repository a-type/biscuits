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
						className="group grid grid-cols-[auto_1fr] grid-areas-[icon_name]-[description_description] items-center gap-md p-md font-normal"
					>
						<h3 className="grid-area-[name] m-0 text-lg font-semibold">
							{app.name}
						</h3>
						<img
							src={`${app.url}/${app.iconPath}`}
							alt=""
							className="grid-area-[icon] h-16 w-16"
						/>
						<div className="grid-area-[description] text-sm text-gray-ink">
							{app.description}
						</div>
						<Icon
							name="new_window"
							className="absolute right-md top-md transition-transform [.group:hover>&]:(translate-x-2 -translate-y-2)"
						/>
					</Card.Main>
				</Card>
			))}
		</Box>
	);
}
