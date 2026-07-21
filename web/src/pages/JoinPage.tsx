import { Footer } from '@/components/help/Footer.jsx';
import {
	Box,
	Button,
	Divider,
	Icon,
	PageContent,
	PageFixedArea,
	PageRoot,
	PageSectionGrid,
} from '@a-type/ui';
import { PaidFeature, apps } from '@biscuits/apps';
import { Link } from '@biscuits/client';
import { StartingPrice } from '@biscuits/client/subscription';
import { useSearch } from '@tanstack/react-router';
import classes from './JoinPage.module.css';

export interface JoinPageProps {}

export function JoinPage({}: JoinPageProps) {
	const search = useSearch({ strict: false }) as Record<string, string>;
	const appReferrer = search.appReferrer;
	const backTo = search.backTo || search.returnTo;

	const sortedApps =
		appReferrer ?
			[...apps].sort((a, b) =>
				a.id === appReferrer ? -1
				: b.id === appReferrer ? 1
				: 0,
			)
		:	apps;

	return (
		<PageRoot className={classes.pageRoot}>
			<PageContent className={classes.pageContent}>
				<div className={classes.mainCol}>
					<h1 className={classes.heading}>
						Join Biscuits to unlock features and collaboration in every app
					</h1>
					<p>
						Biscuits apps are always free to use, but members can sync data
						across devices, use fancy new features, and even share with family
						and friends. Plans start at <StartingPrice />.
					</p>
					<PageFixedArea className={classes.topBar}>
						<Button
							render={<Link to={(backTo as any) || '/'} />}
							emphasis="default"
						>
							<Icon name="arrowLeft" />
							{backTo ? 'Go back' : 'Back to apps'}
						</Button>
						<Button
							render={
								<Link
									to="/login"
									search={{
										returnTo: '/settings?tab=subscription&tab=signup',
									}}
								/>
							}
							emphasis="primary"
						>
							Get started
						</Button>
					</PageFixedArea>
					{sortedApps
						.filter((app) => !app.prerelease)
						.map((app) => (
							<Box gap col full="width" key={app.id}>
								<div className={classes.appRow}>
									<img
										src={`${app.url}/${app.iconPath}`}
										alt={app.name}
										width={48}
									/>
									<h2 className={classes.appName}>{app.name}</h2>
								</div>
								<p>{app.paidDescription}</p>
								<PageSectionGrid>
									{app.paidFeatures.map((feature, index) => (
										<AppFeature key={index} feature={feature} />
									))}
								</PageSectionGrid>
								<Divider className={classes.divider} />
							</Box>
						))}
				</div>
				<Footer />
			</PageContent>
		</PageRoot>
	);
}

function AppFeature({ feature }: { feature: PaidFeature }) {
	return (
		<div className={classes.featureItem}>
			<div className={classes.featureHeader}>
				<h3 className={classes.featureTitle}>{feature.title}</h3>
				{feature.family && (
					<div className={classes.premiumBadge}>Family Style Plan</div>
				)}
			</div>
			<p className={classes.featureDescription}>{feature.description}</p>
			{feature.imageUrl && (
				<img
					className={classes.featureImage}
					src={feature.imageUrl}
					alt="a visualization of the described feature"
				/>
			)}
		</div>
	);
}

export default JoinPage;
