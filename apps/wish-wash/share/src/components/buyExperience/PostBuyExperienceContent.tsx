import {
	Box,
	Dialog,
	FormikForm,
	NumberStepperField,
	P,
	SubmitButton,
	TextField,
} from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { usePurchaseItem } from '~/hooks.js';

export const postBuyExperienceContentFragment = graphql(`
	fragment PostBuyExperienceContent on PublishedWishlistItem {
		id
		description
		count
	}
`);

export function PostBuyExperienceContent({
	item: itemMasked,
	listAuthor,
}: {
	item: FragmentOf<typeof postBuyExperienceContentFragment>;
	listAuthor: string;
}) {
	const item = readFragment(postBuyExperienceContentFragment, itemMasked);
	const [purchase, { data: succeeded }] = usePurchaseItem(item.id);

	if (succeeded) {
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
						Tell them how many you bought to avoid duplicates
					</Dialog.Description>
					<NumberStepperField name="quantity" label="I bought..." />
				</>
			:	<>
					<Dialog.Description>
						Tell them you bought it to avoid duplicates
					</Dialog.Description>
					<input type="hidden" name="quantity" value={1} />
				</>
			}
			<Box surface col gap p full="width">
				<TextField name="name" label="Your name (optional)" />
				<SubmitButton emphasis="primary" className="ml-auto">
					I bought it!
				</SubmitButton>
			</Box>
		</FormikForm>
	);
}
