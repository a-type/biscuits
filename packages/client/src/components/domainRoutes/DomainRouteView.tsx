import {
	Box,
	Button,
	Dialog,
	FormikForm,
	Icon,
	SubmitButton,
	TextField,
	TextSkeleton,
} from '@a-type/ui';
import { graphql, useMutation, useQuery } from '@biscuits/graphql';
import { useState } from 'react';
import { DomainRouteValidation, useAppId } from '../index.js';
import { DeleteDomainRoute } from './DeleteDomainRoute.js';

export interface DomainRouteViewProps {
	resourceId: string;
}

const domainStatusQuery = graphql(`
	query DomainRouteStatus($input: GetDomainRouteByAppInput!) {
		domainRoute(byApp: $input) {
			id
			status
			domain
		}
	}
`);

const reprovisionDomainMutation = graphql(`
	mutation ReprovisionDomain($id: ID!) {
		reprovisionDomainRoute(id: $id) {
			id
			status
			domain
		}
	}
`);

export function DomainRouteView({ resourceId }: DomainRouteViewProps) {
	const [open, setOpen] = useState(false);
	const appId = useAppId();
	const [reprovision] = useMutation(reprovisionDomainMutation);
	const { data, refetch } = useQuery(domainStatusQuery, {
		variables: {
			input: {
				appId,
				resourceId,
			},
		},
		onCompleted: async (data) => {
			// auto-fix if cert was not provisioned
			const route = data?.domainRoute;
			if (route && route.status === 'UNPROVISIONED') {
				console.warn(`Reprovisioning domain ${route.domain}`);
				await reprovision({
					variables: { id: route.id },
				});
			}
		},
	});

	if (data && data.domainRoute === null) {
		return (
			<DomainRouteRegister
				resourceId={resourceId}
				onSubmit={async () => {
					await refetch();
					setOpen(true);
				}}
			/>
		);
	}

	const domain = data?.domainRoute?.domain;
	const status = data?.domainRoute?.status;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<Button
					color={status === 'READY' ? 'accent' : 'default'}
					className="justify-between"
				>
					{domain ?? <TextSkeleton maxLength={30} />}
					<Icon name={status === 'READY' ? 'check' : 'warning'} />
				</Button>
			</Dialog.Trigger>
			<Dialog.Content className="flex flex-col gap-md">
				<DomainRouteValidation resourceId={resourceId} />
				{data?.domainRoute && (
					<DeleteDomainRoute
						domainRouteId={data.domainRoute.id}
						onDelete={refetch}
						className="self-start"
					/>
				)}
				<Dialog.Actions>
					<Dialog.Close asChild>
						<Button>Close</Button>
					</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}

const domainRegisterMutation = graphql(`
	mutation registerDomain($input: CreateDomainRouteInput!) {
		createDomainRoute(input: $input) {
			domainRoute {
				id
			}
		}
	}
`);

function DomainRouteRegister({
	resourceId,
	onSubmit,
}: {
	resourceId: string;
	onSubmit?: () => void;
}) {
	const appId = useAppId();
	const [mutate] = useMutation(domainRegisterMutation, {
		onCompleted: () => {
			onSubmit?.();
		},
	});
	return (
		<FormikForm
			initialValues={{
				domain: '',
			}}
			onSubmit={async (values, bag) => {
				let domain = values.domain;
				if (protocolMatch.test(domain)) {
					domain = domain.replace(protocolMatch, '');
				}
				if (!hostnameMatch.test(domain)) {
					console.error('Invalid domain', domain);
					bag.setFieldError('domain', 'Invalid domain');
					return;
				}
				await mutate({
					variables: {
						input: {
							appId,
							resourceId,
							domain,
						},
					},
				});
			}}
		>
			<Box d="row" gap items="end" full>
				<TextField
					placeholder="blog.yourdomain.club"
					name="domain"
					label="Register a domain"
					className="flex-1"
				/>
				<SubmitButton color="primary" size="icon">
					<Icon name="arrowRight" />
				</SubmitButton>
			</Box>
		</FormikForm>
	);
}

const hostnameMatch = /[a-z0-9-]+\.[a-z0-9-]+/;
const protocolMatch = /^(https?:\/\/)?/;
