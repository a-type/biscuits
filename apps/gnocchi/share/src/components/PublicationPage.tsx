import {
	Card,
	clsx,
	H1,
	PageContent,
	PageRoot,
	tipTapReadonlyClassName,
} from '@a-type/ui';
import { tiptapToString } from '@biscuits/client';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { Link } from '@tanstack/react-router';
import LinkExt from '@tiptap/extension-link';
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
						prelude
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
								<Card.Image asChild>
									<img src={node.data.mainImageUrl} alt={node.data.title} />
								</Card.Image>
							)}
							<Card.Main
								asChild
								className={node.data.mainImageUrl ? 'min-h-120px' : ''}
							>
								<Link to={node.url}>
									<Card.Title>{node.data.title}</Card.Title>
									{node.data.prelude && (
										<Card.Content>
											{tiptapToString(node.data.prelude)}
										</Card.Content>
									)}
								</Link>
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
	LinkExt.configure({
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
