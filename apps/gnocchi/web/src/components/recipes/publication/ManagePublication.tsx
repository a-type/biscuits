import {
	Box,
	clsx,
	CollapsibleSimple,
	Dialog,
	FieldLabel,
	FieldRoot,
	FormikForm,
	P,
	tipTapClassName,
	toast,
	useField,
} from '@a-type/ui';
import { DomainRouteView } from '@biscuits/client';
import { graphql, useMutation, useSuspenseQuery } from '@biscuits/graphql';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ReactNode, Suspense, useState } from 'react';

export interface ManagePublicationProps {
	className?: string;
	asChild?: boolean;
	children?: ReactNode;
}

export const managePublicationQuery = graphql(`
	query ManagePublication {
		recipePublication {
			id
			publicationName
			publishedAt
			description
		}
	}
`);

const updatePublicationMutation = graphql(`
	mutation UpdatePublication($input: UpdateRecipePublicationInput!) {
		updateRecipePublication(input: $input) {
			id
			publicationName
			publishedAt
			description
		}
	}
`);

export function ManagePublication({
	className,
	asChild,
	children,
}: ManagePublicationProps) {
	const { data, refetch } = useSuspenseQuery(managePublicationQuery);
	const [mutate] = useMutation(updatePublicationMutation, {
		onCompleted: () => {
			refetch();
		},
	});

	const validDescription = validateDescription(
		data.recipePublication?.description,
	);

	const [open, setOpen] = useState(false);

	const publicationId = data.recipePublication?.id ?? '';
	const isPublishedLive = Boolean(data.recipePublication?.publishedAt);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild={asChild} className={className}>
				{children}
			</Dialog.Trigger>
			<Dialog.Content className="flex flex-col gap-md" width="md">
				<Dialog.Title>Your Publication</Dialog.Title>
				<Dialog.Description>
					You can manage how your recipes are published online here.
				</Dialog.Description>

				<FormikForm
					initialValues={{
						publicationName: data.recipePublication?.publicationName ?? '',
						description: validDescription,
						isPublished: isPublishedLive,
					}}
					enableReinitialize
					onSubmit={async (values) => {
						await mutate({
							variables: {
								input: {
									publicationName: values.publicationName,
									description: values.description,
									isPublished: values.isPublished,
								},
							},
						});
						toast.success('Updated your blog config!');
					}}
				>
					{({ values, dirty }) => {
						return (
							<Box col gap>
								<Box
									surface
									color={
										isPublishedLive && values.isPublished
											? 'success'
											: 'primary'
									}
									p
									col
									gap
								>
									<FormikForm.SwitchField
										name="isPublished"
										label="Publish a recipe blog"
									/>
									<P>
										{isPublishedLive && values.isPublished
											? 'Your blog is live! You can now add a custom domain, if you want one.'
											: "When you turn this on, we'll compile your published recipes into a single site. You can connect a custom domain, too."}
									</P>
								</Box>

								<CollapsibleSimple
									open={!!values.isPublished}
									className="w-full"
								>
									<Box col gap full="width">
										<FormikForm.TextField
											name="publicationName"
											label="Blog name"
										/>
										<Suspense
											fallback={
												<Box surface className="h-120px" full="width" />
											}
										>
											<DescriptionField />
										</Suspense>
									</Box>
								</CollapsibleSimple>
								{dirty && (
									<Box gap justify="end">
										<FormikForm.SubmitButton>Save</FormikForm.SubmitButton>
									</Box>
								)}
							</Box>
						);
					}}
				</FormikForm>

				<Box surface p col gap>
					<P className="font-bold">Custom domain</P>
					{publicationId ? (
						<DomainRouteView resourceId={publicationId} />
					) : (
						<P>Enable your blog first to set up a custom domain.</P>
					)}
				</Box>

				<Dialog.Actions>
					<Dialog.Close>Done</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}

const descriptionExtensions = [
	StarterKit.configure(),
	Link.configure({
		openOnClick: false,
	}),
];

function DescriptionField() {
	const [_, { value }, tools] = useField({
		name: 'description',
	});

	const editor = useEditor({
		content: value,
		onUpdate: ({ editor }) => {
			tools.setValue(editor.getJSON());
		},
		extensions: descriptionExtensions,
	});

	return (
		<FieldRoot>
			<FieldLabel>Description</FieldLabel>
			<EditorContent
				editor={editor}
				className={clsx(tipTapClassName, '[&>div]:min-h-120px')}
			/>
		</FieldRoot>
	);
}

const defaultDescription = {
	type: 'doc',
	content: [],
};
function validateDescription(description: any): any {
	if (!description) {
		return defaultDescription;
	}
	if (typeof description !== 'object' || Array.isArray(description)) {
		return defaultDescription;
	}
	if (description.type !== 'doc' || !Array.isArray(description.content)) {
		return defaultDescription;
	}
	return description;
}
