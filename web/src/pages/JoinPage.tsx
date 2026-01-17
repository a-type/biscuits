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
import { StartingPrice } from '@biscuits/client/subscription';
import { Link, useSearchParams } from '@verdant-web/react-router';
import classNames from 'classnames';

export interface JoinPageProps {}

export function JoinPage({}: JoinPageProps) {
	const [search] = useSearchParams();
	const appReferrer = search.get('appReferrer');
	const backTo = search.get('backTo') || search.get('returnTo');

	const sortedApps =
		appReferrer ?
			[...apps].sort((a, b) =>
				a.id === appReferrer ? -1
				: b.id === appReferrer ? 1
				: 0,
			)
		:	apps;

	return (
		<PageRoot className="bg-primary-wash">
			<PageContent className="bg-primary-wash">
				<div className="w-full flex flex-col gap-6">
					<h1 className={classNames('color-primary-ink')}>
						Join Biscuits to unlock features and collaboration in every app
					</h1>
					<p>
						Biscuits apps are always free to use, but members can sync data
						across devices, use fancy new features, and even share with family
						and friends. Plans start at <StartingPrice />.
					</p>
					<PageFixedArea className="flex flex-row justify-between gap-3 py-4 bg-transparent">
						<Button render={<Link to={backTo || '/'} />} emphasis="default">
							<Icon name="arrowLeft" />
							{backTo ? 'Go back' : 'Back to apps'}
						</Button>
						<Button
							render={
								<Link to="/login?returnTo=/settings?tab=subscription&tab=signup" />
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
								<div className="flex flex-row items-center gap-md">
									<img
										src={`${app.url}/${app.iconPath}`}
										alt={app.name}
										width={48}
									/>
									<h2 className="m-0">{app.name}</h2>
								</div>
								<p>{app.paidDescription}</p>
								<PageSectionGrid>
									{app.paidFeatures.map((feature, index) => (
										<AppFeature key={index} feature={feature} />
									))}
								</PageSectionGrid>
								<Divider className="my-8" />
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
		<div className="flex flex-col items-start gap-4">
			<div className="flex flex-row flex-wrap items-center gap-3">
				<h3 className="my-0 text-md font-normal">{feature.title}</h3>
				{feature.family && (
					<div className="rounded-full px-3 py-1 text-xs color-white bg-accent-dark">
						Family Style Plan
					</div>
				)}
			</div>
			<p className="my-0">{feature.description}</p>
			{feature.imageUrl && (
				<img
					className="max-w-full min-w-0 flex-1-0-0 border-1 border rounded-lg border-solid border-black"
					src={feature.imageUrl}
					alt="a visualization of the described feature"
				/>
			)}
		</div>
	);
}

export default JoinPage;
