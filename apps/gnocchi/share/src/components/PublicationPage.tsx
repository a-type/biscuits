import {
	Card,
	clsx,
	H1,
	PageContent,
	PageRoot,
	tipTapReadonlyClassName,
} from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const publicationPageFragment = graphql(`
	fragment PublicationPage on RecipePublication {
		id
		publicationName
		description

		recipesConnection {
			edges {
				node {
					id
					url
					data {
						title
						mainImageUrl
					}
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
`);

export interface PublicationPageProps {
	data: FragmentOf<typeof publicationPageFragment>;
}

export function PublicationPage({ data }: PublicationPageProps) {
	const publication = readFragment(publicationPageFragment, data);

	return (
		<PageRoot>
			<PageContent>
				<H1>{publication.publicationName}</H1>
				{publication.description && (
					<DescriptionRenderer description={publication.description} />
				)}
				<Card.Grid>
					{publication.recipesConnection.edges.map(({ node }) => (
						<Card key={node.id}>
							{node.data.mainImageUrl && (
								<Card.Image>
									<img src={node.data.mainImageUrl} alt={node.data.title} />
								</Card.Image>
							)}
							<Card.Main
								asChild
								className={node.data.mainImageUrl ? 'min-h-120px' : ''}
							>
								<a href={node.url}>
									<Card.Title>{node.data.title}</Card.Title>
								</a>
							</Card.Main>
						</Card>
					))}
				</Card.Grid>
			</PageContent>
		</PageRoot>
	);
}

const descriptionExtensions = [
	StarterKit.configure(),
	Link.configure({
		openOnClick: false,
	}),
];

function DescriptionRenderer({ description }: { description: any }) {
	const editor = useEditor({
		content: description,
		editable: false,
		extensions: descriptionExtensions,
	});

	return (
		<EditorContent editor={editor} className={clsx(tipTapReadonlyClassName)} />
	);
}
