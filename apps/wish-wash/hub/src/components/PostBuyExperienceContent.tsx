import { usePurchaseItem } from '@/hooks.js';
import { HubWishlistItem } from '@/types.js';
import {
	Box,
	Dialog,
	FormikForm,
	NumberStepperField,
	P,
	SubmitButton,
	TextField,
} from '@a-type/ui';

export function PostBuyExperienceContent({
	item,
	listAuthor,
}: {
	item: HubWishlistItem;
	listAuthor: string;
}) {
	const [purchase, { data }] = usePurchaseItem(item.id);

	if (data?.purchasePublicItem) {
		return (
			<Box d="col" gap>
				<Dialog.Title>Thanks for telling us!</Dialog.Title>
				<P>
					Sometimes people don't bother. That's how you get three waffle irons!
				</P>
			</Box>
		);
	}

	return (
		<FormikForm
			initialValues={{ quantity: 1, name: '' }}
			onSubmit={async (
				values: { quantity: number; name: string },
				form: any,
			) => {
				await purchase(values);
				form.resetForm();
			}}
		>
			<Dialog.Title>Did you buy {item.description}?</Dialog.Title>
			{item.count !== 1 ?
				<>
					<Dialog.Description>
						Tell {listAuthor} how many you bought to avoid duplicates
					</Dialog.Description>
					<NumberStepperField name="quantity" label="I bought..." />
				</>
			:	<>
					<Dialog.Description>
						Tell {listAuthor} you bought it to avoid duplicates
					</Dialog.Description>
					<input type="hidden" name="quantity" value={1} />
				</>
			}
			<TextField name="name" label="Your name (optional)" />
			<SubmitButton>I bought it!</SubmitButton>
		</FormikForm>
	);
}
