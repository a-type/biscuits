import {
	Box,
	Button,
	H1,
	H2,
	Icon,
	P,
	PageContent,
	PageRoot,
} from '@a-type/ui';
import { CONFIG } from '@biscuits/client';

import {
	StartingPrice,
	SubscriptionSetup,
} from '@biscuits/client/subscription';

export interface BuyYearlyPageProps {}

export function BuyYearlyPage({}: BuyYearlyPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<Box col gap style={{ margin: 'auto' }}>
					<H1 className="font-fancy font-medium">Finish your subscription</H1>
					<P>
						You're about to get device sync and list sharing for a full year.
					</P>
					<MemberUpsell />
					<YearlyPaymentForm />
				</Box>
			</PageContent>
		</PageRoot>
	);
}

export default BuyYearlyPage;

function MemberUpsell() {
	return (
		<Box col gap items="start" surface="secondary" color="accent">
			<H2>
				<Icon name="lightbulb" /> Or, get all our apps
			</H2>
			<P>
				Subscribe to Biscuits for <StartingPrice /> and get full premium
				features and device sync, including all Wish Wash features like list
				sharing.
			</P>
			<Button
				emphasis="light"
				color="accent"
				render={
					<a
						href={`${CONFIG.HOME_ORIGIN}/join?returnTo=${window.location.href}`}
					/>
				}
			>
				Learn more
			</Button>
		</Box>
	);
}

function YearlyPaymentForm() {
	return <SubscriptionSetup priceKeys={['wishwash_yearly']} />;
}
