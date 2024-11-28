import { H2, P } from '@a-type/ui';
import { DemoFrame } from './DemoFrame.jsx';

export interface SubscriptionPromotionContentProps {}

export function SubscriptionPromotionContent({}: SubscriptionPromotionContentProps) {
	return (
		<>
			<P className="mb-4">Make Gnocchi your household's new grocery list.</P>
			<div className="grid grid-cols-[1fr] gap-3 md:grid-cols-[2fr_1fr]">
				<div className="flex flex-col">
					<H2 className="mb-2">
						Sync with family or friends so everyone's on the same page
					</H2>
					<P className="mb-4">Everyone you invite can add items to the list.</P>
					<H2 className="mb-2">Team up at the store with live collaboration</H2>
					<P>
						New items show up on everyone's phone as they're added to the list.
						See who bought what as you go, and claim aisles to shop together
						efficiently.
					</P>
				</div>
				<DemoFrame demo="multiplayer-groceries" />
				<div>
					<H2 className="mb-2">More recipe tools</H2>
					<P className="mb-4">
						Unlock the recipe scanner &mdash; just paste a URL and Gnocchi will
						create a copy of the recipe for you.
					</P>
					<P>
						Collaborate on cooking in real-time, assign steps to each cook, and
						stay on the same page.
					</P>
				</div>
				<DemoFrame demo="multiplayer-cooking" />
			</div>
		</>
	);
}
