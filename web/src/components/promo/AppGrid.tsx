import { Card, clsx, Icon } from '@a-type/ui';
import { getAppUrl, visibleApps } from '@biscuits/apps';
import { Link } from '@verdant-web/react-router';
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
						<h3 className={classes.name}>{app.name}</h3>
						<img
							src={`${app.url}/${app.iconPath}`}
							alt=""
							className={classes.appIcon}
						/>
						<div className={classes.description}>{app.description}</div>
						<Icon name="new_window" className={classes.externalIcon} />
					</Card.Main>
				</Card>
			))}
		</div>
	);
}
