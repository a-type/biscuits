import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const publicationPageFragment = graphql(`
	fragment PublicationPage on RecipePublication {
		id
		publicationName

		recipesConnection {
			edges {
				node {
					id
					url
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
		<div>
			<h1>Publication: {publication.publicationName}</h1>
			<ul>
				{publication.recipesConnection.edges.map(({ node }) => (
					<li key={node.id}>
						<a href={node.url}>{node.url}</a>
					</li>
				))}
			</ul>
		</div>
	);
}
