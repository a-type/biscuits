import { Button } from '@a-type/ui/components/button';
import { Checkbox } from '@a-type/ui/components/checkbox';
import {
	Dialog,
	DialogContent,
	DialogActions,
	DialogTitle,
	DialogClose,
} from '@a-type/ui/components/dialog';
import { featureFlags } from '@biscuits/client';
import { graphql, useMutation, useSuspenseQuery } from '@biscuits/graphql';
import { useSearchParams } from '@verdant-web/react-router';

export interface AdminPlansPageProps {}

const plans = graphql(`
	query AdminPlans($after: ID) {
		plans(first: 50, after: $after) {
			edges {
				node {
					id
					subscriptionStatus
					featureFlags
					members {
						id
						email
						role
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

const setFlagMutation = graphql(`
	mutation SetFlag($planId: ID!, $flagName: String!, $enabled: Boolean!) {
		setFeatureFlag(planId: $planId, flagName: $flagName, enabled: $enabled) {
			id
			featureFlags
		}
	}
`);

export function AdminPlansPage({}: AdminPlansPageProps) {
	const [search, setSearch] = useSearchParams();
	const selectedId = search.get('planId');

	const { data, fetchMore } = useSuspenseQuery(plans, {
		variables: {
			after: undefined,
		},
		refetchWritePolicy: 'merge',
	});

	const loadMore = () => {
		fetchMore({
			variables: {
				after: data.plans.pageInfo.endCursor,
			},
		});
	};

	const [setFlag] = useMutation(setFlagMutation);

	const selected = data.plans.edges.find(
		({ node }) => node.id === selectedId,
	)?.node;

	return (
		<div className="col">
			<ul>
				{data.plans.edges.map(({ node }) => (
					<li key={node.id}>
						<b>
							{node.id} | {node.subscriptionStatus}
						</b>
						<ul>
							{node.members.map((member) => (
								<li key={member.id}>
									{member.email} ({member.role})
								</li>
							))}
						</ul>
						<Button
							onClick={() =>
								setSearch((old) => {
									old.set('planId', node.id.toString());
									return old;
								})
							}
						>
							Open
						</Button>
					</li>
				))}
			</ul>
			{data.plans.pageInfo.hasNextPage && (
				<button onClick={loadMore}>Load More</button>
			)}
			<Dialog
				open={!!selected}
				onOpenChange={(open) => {
					if (!open)
						setSearch((old) => {
							old.delete('planId');
							return old;
						});
				}}
			>
				<DialogContent>
					<DialogTitle>{selected?.id}</DialogTitle>
					<ul>
						{selected?.members.map((member) => (
							<li key={member.id}>
								{member.email} ({member.role})
							</li>
						))}
					</ul>
					<h3>Feature Flags</h3>
					<ul>
						{Object.keys(featureFlags).map((flag) => (
							<li className="row" key={flag}>
								<Checkbox
									checked={selected?.featureFlags.includes(flag)}
									onCheckedChange={async (checked) => {
										await setFlag({
											variables: {
												planId: selectedId!,
												flagName: flag,
												enabled: !!checked,
											},
										});
									}}
								/>{' '}
								{flag}
							</li>
						))}
					</ul>
					<DialogActions>
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default AdminPlansPage;
