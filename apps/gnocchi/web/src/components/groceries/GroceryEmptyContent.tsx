import { P } from '@a-type/ui';
import { InfrequentSubscriptionHint } from '@biscuits/client';
import { InstallHint } from '@biscuits/client/apps';
import { Cart } from '../graphics/Cart.jsx';
import cls from './GroceryEmptyContent.module.css';
import { MeetupHint } from './meetup/MeetupHint.jsx';

export function GroceryEmptyContent() {
	return (
		<div className={cls.root}>
			<div className={cls.content}>
				<Cart
					width="15vmax"
					style={{
						maxWidth: 200,
					}}
				/>
				<P className={cls.text}>Your list is empty</P>
				<P className={cls.text}>Use the button below to add items</P>
			</div>
			<MeetupHint />
			<InstallHint content="Always have your list on hand. Install the app!" />
			<InfrequentSubscriptionHint />
		</div>
	);
}
