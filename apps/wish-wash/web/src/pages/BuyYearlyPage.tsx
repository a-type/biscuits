import { Button, H1, H2, Icon, P, PageContent, PageRoot } from '@a-type/ui';
import { CONFIG, StartingPrice, SubscriptionSetup } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';

export interface BuyYearlyPageProps {}

export function BuyYearlyPage({}: BuyYearlyPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<div className="flex flex-col gap-4 m-auto">
					<H1 className="font-fancy font-medium">Finish your subscription</H1>
					<P>
						You're about to get device sync and list sharing for a full year.
					</P>
					<MemberUpsell />
					<YearlyPaymentForm />
				</div>
			</PageContent>
		</PageRoot>
	);
}

export default BuyYearlyPage;

function MemberUpsell() {
	return (
		<div className="col items-start p-3 bg-accent-wash border-accent-dark border-1 border-solid rounded-lg">
			<H2>
				<Icon name="lightbulb" /> Or, get all our apps
			</H2>
			<P>
				Subscribe to Biscuits for <StartingPrice /> and get full premium
				features and device sync, including all Wish Wash features like list
				sharing.
			</P>
			<Button asChild color="accent">
				<Link
					to={`${CONFIG.HOME_ORIGIN}/join?returnTo=${window.location.href}`}
				>
					Learn more
				</Link>
			</Button>
		</div>
	);
}

function YearlyPaymentForm() {
	return <SubscriptionSetup priceKeys={['wishwash_yearly']} />;
}
