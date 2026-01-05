import { Box, BoxProps, P } from '@a-type/ui';
import { DomainRouteView } from '@biscuits/client';
import { useSuspenseQuery } from '@biscuits/graphql';
import {
	ManagePublication,
	managePublicationQuery,
} from './ManagePublication.jsx';

export interface PublicationDetailsProps extends BoxProps {}

export function PublicationDetails(props: PublicationDetailsProps) {
	const { data } = useSuspenseQuery(managePublicationQuery);

	if (!data.recipePublication?.publishedAt) {
		return (
			<Box col gap {...props}>
				<P>
					Recipe blog not enabled. You can still share recipes individually as
					links.
				</P>
				<ManagePublication className="ml-auto">
					Set up your blog
				</ManagePublication>
			</Box>
		);
	}

	return (
		<Box col gap {...props}>
			<div>Your blog</div>
			<div className="text-lg font-medium">
				{data.recipePublication.publicationName}
			</div>
			<div>
				Published{' '}
				{new Date(data.recipePublication.publishedAt).toLocaleDateString()}
			</div>
			<div>
				<DomainRouteView resourceId={data.recipePublication.id} />
			</div>
			<ManagePublication className="ml-auto">
				Manage your blog
			</ManagePublication>
		</Box>
	);
}
