import { P } from '@a-type/ui';
import { InfrequentSubscriptionHint } from '@biscuits/client';
import { InstallHint } from '@biscuits/client/apps';
import { Cart } from '../graphics/Cart.jsx';
import { MeetupHint } from './meetup/MeetupHint.jsx';

export function GroceryEmptyContent() {
	return (
		<div className="flex flex-col p-4 gap-6 select-none">
			<div className="flex flex-col items-center justify-center flex-grow-1 text-center color-gray7 italic text-sm gap-3 p-4">
				<Cart
					width="15vmax"
					style={{
						maxWidth: 200,
					}}
				/>
				<P className="[font-size:inherit]">Your list is empty</P>
				<P className="[font-size:inherit]">Use the button below to add items</P>
			</div>
			<MeetupHint />
			<InstallHint content="Always have your list on hand. Install the app!" />
			<InfrequentSubscriptionHint />
		</div>
	);
}
