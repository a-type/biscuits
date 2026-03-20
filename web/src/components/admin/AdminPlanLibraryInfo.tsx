import { Dialog } from '@a-type/ui';
import { graphql, useSuspenseQuery } from '@biscuits/graphql';
import { Suspense } from 'react';

export interface AdminPlanLibraryInfoProps {
	appId: string;
	planId: string;
}

const LibraryInfoQuery = graphql(`
	query AdminPlanLibraryInfo($appId: String!, $planId: ID!) {
		adminPlan(id: $planId) {
			id
			libraryInfo(app: $appId, access: "members") {
				id
				baselinesCount
				globalAck
				latestServerOrder
				operationsCount
				replicas(includeTruant: true) {
					id
					ackedLogicalTime
					ackedServerOrder
					truant
					profile {
						id
						name
					}
				}
			}
		}
	}
`);

export function AdminPlanLibraryInfo({
	appId,
	planId,
}: AdminPlanLibraryInfoProps) {
	return (
		<Dialog>
			<Dialog.Trigger>{appId} data</Dialog.Trigger>
			<Dialog.Content width="lg">
				<Suspense>
					<AdminPlanLibraryInfoContent appId={appId} planId={planId} />
				</Suspense>
			</Dialog.Content>
		</Dialog>
	);
}

function AdminPlanLibraryInfoContent({
	appId,
	planId,
}: AdminPlanLibraryInfoProps) {
	const { data } = useSuspenseQuery(LibraryInfoQuery, {
		variables: { appId, planId },
	});

	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
