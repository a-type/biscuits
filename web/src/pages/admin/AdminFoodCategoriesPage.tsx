import { Box, Button, ConfirmedButton, FormikForm, Icon } from '@a-type/ui';
import {
	FragmentOf,
	graphql,
	readFragment,
	useMutation,
	useSuspenseQuery,
} from '@biscuits/graphql';
import { generateKeyBetween } from 'fractional-indexing';

const adminCategoryFragment = graphql(`
	fragment AdminCategory on FoodCategory {
		id
		name
		sortKey
	}
`);

const adminFoodCategoriesQuery = graphql(
	`
		query AdminFoodCategories {
			foodCategories {
				id
				sortKey
				...AdminCategory
			}
		}
	`,
	[adminCategoryFragment],
);

const adminAddFoodCategoryMutation = graphql(
	`
		mutation AdminAddFoodCategory($input: CreateCategoryInput!) {
			createFoodCategory(input: $input) {
				category {
					id
					...AdminCategory
				}
			}
		}
	`,
	[adminCategoryFragment],
);

const adminUpdateFoodCategoryMutation = graphql(
	`
		mutation AdminUpdateFoodCategory($input: UpdateCategoryInput!) {
			updateFoodCategory(input: $input) {
				category {
					id
					...AdminCategory
				}
			}
		}
	`,
	[adminCategoryFragment],
);

const adminDeleteFoodCategoryMutation = graphql(
	`
		mutation AdminDeleteFoodCategory($categoryId: ID!) {
			deleteFoodCategory(categoryId: $categoryId) {
				categories {
					id
					...AdminCategory
				}
			}
		}
	`,
	[adminCategoryFragment],
);

const AdminFoodCategoriesPage = () => {
	const { data } = useSuspenseQuery(adminFoodCategoriesQuery, {});
	const categories = data.foodCategories.toSorted((a, b) =>
		a.sortKey.localeCompare(b.sortKey),
	);
	return (
		<Box col gap>
			<h1>Food Categories</h1>
			{categories.map((category, i) => (
				<CategoryItem
					key={category.id}
					category={category}
					prev={
						categories[i - 1] ?
							generateKeyBetween(
								categories[i - 2]?.sortKey ?? null,
								categories[i - 1].sortKey,
							)
						:	undefined
					}
					next={
						categories[i + 1] ?
							generateKeyBetween(
								categories[i + 1].sortKey,
								categories[i + 2]?.sortKey ?? null,
							)
						:	undefined
					}
				/>
			))}
			<NewCategoryForm />
		</Box>
	);
};

function CategoryItem({
	category: raw,
	prev,
	next,
}: {
	category: FragmentOf<typeof adminCategoryFragment>;
	prev?: string;
	next?: string;
}) {
	const category = readFragment(adminCategoryFragment, raw);
	const [mutate] = useMutation(adminUpdateFoodCategoryMutation);
	const [deleteMutate] = useMutation(adminDeleteFoodCategoryMutation, {
		refetchQueries: [adminFoodCategoriesQuery],
	});

	const movePrev = async () => {
		if (!prev) return;
		await mutate({
			variables: {
				input: {
					id: category.id,
					sortKey: prev,
				},
			},
		});
	};
	const moveNext = async () => {
		if (!next) return;
		await mutate({
			variables: {
				input: {
					id: category.id,
					sortKey: next,
				},
			},
		});
	};

	return (
		<Box surface border gap p>
			<Box col gap="sm" items="center">
				<Button onClick={movePrev} disabled={!prev}>
					<Icon name="arrowUp" />
				</Button>
				<span className="text-sm text-gray-dark">{category.sortKey}</span>
				<Button onClick={moveNext} disabled={!next}>
					<Icon name="arrowDown" />
				</Button>
			</Box>
			<FormikForm
				initialValues={{ name: category.name }}
				onSubmit={async (values) => {
					await mutate({
						variables: {
							input: {
								id: category.id,
								name: values.name,
							},
						},
					});
				}}
			>
				<FormikForm.TextField name="name" label="Name" />
				<Box layout="center between" gap>
					<ConfirmedButton
						color="attention"
						confirmText="Delete"
						type="button"
						onConfirm={async () => {
							await deleteMutate({
								variables: {
									categoryId: category.id,
								},
							});
						}}
					>
						Delete
					</ConfirmedButton>
					<FormikForm.SubmitButton>Save</FormikForm.SubmitButton>
				</Box>
			</FormikForm>
		</Box>
	);
}

function NewCategoryForm() {
	const [mutate] = useMutation(adminAddFoodCategoryMutation, {
		refetchQueries: [adminFoodCategoriesQuery],
	});

	return (
		<FormikForm
			initialValues={{ name: '' }}
			onSubmit={async (values, { resetForm }) => {
				await mutate({
					variables: {
						input: {
							name: values.name,
						},
					},
				});
				resetForm();
			}}
		>
			<FormikForm.TextField name="name" label="New Category Name" />
			<FormikForm.SubmitButton>Add Category</FormikForm.SubmitButton>
		</FormikForm>
	);
}

export default AdminFoodCategoriesPage;
