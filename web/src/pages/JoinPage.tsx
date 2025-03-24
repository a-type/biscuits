import { Footer } from '@/components/help/Footer.jsx';
import {
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
				<div className="flex flex-col gap-6 w-full">
					<h1 className={classNames('color-gray-dark')}>
						Join Biscuits to unlock features and collaboration in every app
					</h1>
					<p>
						Biscuits apps are always free to use, but members can sync data
						across devices, use fancy new features, and even share with family
						and friends. Plans start at <StartingPrice />.
					</p>
					<PageFixedArea className="flex flex-row gap-3 py-4 justify-between bg-transparent">
						<Button asChild color="default">
							<Link to={backTo || '/'}>
								<Icon name="arrowLeft" />
								{backTo ? 'Go back' : 'Back to apps'}
							</Link>
						</Button>
						<Button asChild color="primary">
							<Link to="/login?returnTo=/settings?tab=subscription&tab=signup">
								Get started
							</Link>
						</Button>
					</PageFixedArea>
					{sortedApps
						.filter((app) => !app.prerelease)
						.map((app) => (
							<div key={app.id} className="w-full max-w-none">
								<div className="flex flex-row items-center gap-4">
									<img
										src={`${app.url}/${app.iconPath}`}
										alt={app.name}
										width={48}
									/>
									<h2>{app.name}</h2>
								</div>
								<p>{app.paidDescription}</p>
								<PageSectionGrid>
									{app.paidFeatures.map((feature, index) => (
										<AppFeature key={index} feature={feature} />
									))}
								</PageSectionGrid>
								<Divider className="my-8" />
							</div>
						))}
				</div>
				<Footer />
			</PageContent>
		</PageRoot>
	);
}

function AppFeature({ feature }: { feature: PaidFeature }) {
	return (
		<div className="flex flex-col gap-4 items-start">
			<div className="flex flex-row items-center gap-3 flex-wrap">
				<h3 className="text-md font-bold my-0">{feature.title}</h3>
				{feature.family && (
					<div className="px-3 py-1 rounded-full bg-accent-dark color-white text-xxs">
						Family Style Plan
					</div>
				)}
			</div>
			<p className="my-0">{feature.description}</p>
			{feature.imageUrl && (
				<img
					className="border border-solid border-1 border-black rounded-lg max-w-full flex-1-0-0 min-w-0"
					src={feature.imageUrl}
					alt="a visualization of the described feature"
				/>
			)}
		</div>
	);
}

export default JoinPage;
