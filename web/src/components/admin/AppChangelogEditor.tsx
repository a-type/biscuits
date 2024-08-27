import { Button } from '@a-type/ui/components/button';
import {
	CardContent,
	CardFooter,
	CardGrid,
	CardImage,
	CardMain,
	CardRoot,
	CardTitle,
} from '@a-type/ui/components/card';
import {
	Dialog,
	DialogContent,
	DialogClose,
	DialogActions,
	DialogTitle,
	DialogTrigger,
} from '@a-type/ui/components/dialog';
import {
	FormikForm,
	SubmitButton,
	TextAreaField,
	TextField,
	CheckboxField,
} from '@a-type/ui/components/forms';
import { AppId } from '@biscuits/apps';
import { graphql, useMutation, useSuspenseQuery } from '@biscuits/graphql';
import { toast } from '@a-type/ui';
import { ConfirmedButton } from '@a-type/ui/components/button';
import { useState } from 'react';

export interface AppChangelogEditorProps {
	appId: AppId;
}

const currentChangelog = graphql(`
	query CurrentChangelog($appId: String!) {
		changelog(appId: $appId) {
			id
			title
			details
			imageUrl
			important
			createdAt
		}
	}
`);

const createChangelogItem = graphql(`
	mutation CreateChangelogItem($input: CreateChangelogItemInput!) {
		createChangelogItem(input: $input) {
			id
			title
			details
			imageUrl
			important
			createdAt
		}
	}
`);

const deleteChangelogItem = graphql(`
	mutation DeleteChangelogItem($id: String!) {
		deleteChangelogItem(id: $id) {
			id
		}
	}
`);

export function AppChangelogEditor({ appId }: AppChangelogEditorProps) {
	const { data, refetch } = useSuspenseQuery(currentChangelog, {
		variables: { appId },
	});
	const [createItem] = useMutation(createChangelogItem);
	const [deleteItem] = useMutation(deleteChangelogItem);

	const [showCreate, setShowCreate] = useState(false);

	return (
		<div className="col">
			<CardGrid>
				{data.changelog.map((item: any) => (
					<CardRoot key={item.id}>
						{item.imageUrl && (
							<CardImage>
								<img src={item.imageUrl} />
							</CardImage>
						)}
						<CardMain>
							<CardTitle>{item.title}</CardTitle>
							<CardContent>{item.details}</CardContent>
						</CardMain>
						<CardFooter>
							<ConfirmedButton
								color="destructive"
								confirmText="Sure?"
								onConfirm={async () => {
									await deleteItem({ variables: { id: item.id } });
									refetch();
								}}
							>
								Delete
							</ConfirmedButton>
						</CardFooter>
					</CardRoot>
				))}
			</CardGrid>
			<Dialog open={showCreate} onOpenChange={setShowCreate}>
				<DialogTrigger asChild>
					<Button>New Changelog Item</Button>
				</DialogTrigger>
				<DialogContent>
					<FormikForm
						initialValues={{
							title: '',
							details: '',
							imageUrl: '',
							important: false,
							appId,
						}}
						onSubmit={async (values, form) => {
							try {
								await createItem({ variables: { input: values } });
								form.resetForm();
								setShowCreate(false);
								refetch();
							} catch (err) {
								console.error(err);
								toast.error((err as any).message);
							}
						}}
					>
						<DialogTitle>New Changelog Item</DialogTitle>
						<TextField name="title" label="Title" />
						<TextAreaField name="details" label="Details" />
						<TextField name="imageUrl" label="Image URL" type="url" />
						<CheckboxField name="important" label="Important" />
						<DialogActions>
							<DialogClose asChild>
								<Button>Cancel</Button>
							</DialogClose>
							<SubmitButton>Publish</SubmitButton>
						</DialogActions>
					</FormikForm>
				</DialogContent>
			</Dialog>
		</div>
	);
}
