import { Box, H2, P } from '@a-type/ui';
import { DemoFrame } from './DemoFrame.jsx';
import cls from './SubscriptionPromotionContent.module.css';

export interface SubscriptionPromotionContentProps {}

export function SubscriptionPromotionContent({}: SubscriptionPromotionContentProps) {
	return (
		<Box col gap>
			<P>Make Gnocchi your household's new grocery list.</P>
			<div className={cls.grid}>
				<Box col gap>
					<H2>Sync with family or friends so everyone's on the same page</H2>
					<P>Everyone you invite can add items to the list.</P>
					<H2>Team up at the store with live collaboration</H2>
					<P>
						New items show up on everyone's phone as they're added to the list.
						See who bought what as you go, and claim aisles to shop together
						efficiently.
					</P>
				</Box>
				<DemoFrame demo="groceries-collaboration" />
				<Box col gap>
					<H2>More recipe tools</H2>
					<P>
						Unlock unlimited scanned web recipes &mdash; just paste a URL and
						Gnocchi will create a copy of the recipe for you.
					</P>
					<P>
						Collaborate on cooking in real-time, assign steps to each cook, and
						stay on the same page.
					</P>
				</Box>
				<DemoFrame demo="recipe-collaboration" />
			</div>
		</Box>
	);
}
