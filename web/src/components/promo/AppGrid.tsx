import { Card, clsx, Icon } from '@a-type/ui';
import { getAppUrl, visibleApps } from '@biscuits/apps';
import { Link } from '@biscuits/client';
import classes from './AppGrid.module.css';

export interface AppGridProps {
	className?: string;
}

export function AppGrid({ className }: AppGridProps) {
	return (
		<div className={clsx(classes.grid, '@mode-loose', className)}>
			{visibleApps.map((app) => (
				<Card key={app.id}>
					<Card.Main
						render={<Link to={getAppUrl(app)} />}
						className={classes.cardMain}
					>
						<Card.Title
							className={clsx(classes.name, '@mode-heading font-fancy')}
						>
							{app.name}
						</Card.Title>
						<img
							src={`${app.url}/${app.iconPath}`}
							alt=""
							className={classes.appIcon}
						/>
						<Card.Content unstyled className={classes.description}>
							{app.description}
						</Card.Content>
						<Icon name="new_window" className={classes.externalIcon} />
					</Card.Main>
				</Card>
			))}
		</div>
	);
}
