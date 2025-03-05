import { Box, BoxProps, Button, H3, Icon, P } from '@a-type/ui';
import { graphql, useQuery } from '@biscuits/graphql';
import { CopyTextbox, useAppId } from '../index.js';

export interface DomainRouteValidationProps extends BoxProps {
	/**
	 * The ID of whatever in the app is linked to the custom domain.
	 * For example, a publication object's ID that can post websites
	 * to a custom domain.
	 */
	resourceId: string;
	onValidated?: () => void;
}

const validateRouteQuery = graphql(`
	query ValidateRoute($input: GetDomainRouteByAppInput!) {
		domainRoute(byApp: $input, validate: true) {
			id
			status
			domain
			note
			tlsRecord {
				name
				value
				type
			}
			mainRecord {
				name
				value
				type
			}
		}
	}
`);

export function DomainRouteValidation({
	resourceId,
	...rest
}: DomainRouteValidationProps) {
	const appId = useAppId();

	const { data, error, refetch } = useQuery(validateRouteQuery, {
		variables: {
			input: {
				appId,
				resourceId,
			},
		},
		onCompleted: (data) => {
			if (data?.domainRoute?.status === 'READY') {
				rest.onValidated?.();
			}
		},
	});

	const status = data?.domainRoute?.status;
	const tlsRecord = data?.domainRoute?.tlsRecord;
	const mainRecord = data?.domainRoute?.mainRecord;
	const note = data?.domainRoute?.note;

	return (
		<Box d="col" gap {...rest}>
			{!!error && (
				<Box gap items="center" surface="attention" p>
					<Icon name="warning" />
					<span>
						Failed to refresh validation status. Please try again in a bit.
					</span>
				</Box>
			)}
			{status === 'READY' ?
				<Box surface="accent" p="lg" d="col" gap items="start">
					<Box gap items="center">
						<Icon name="check" />
						<strong>Success</strong>
					</Box>
					<P>
						<strong>{data?.domainRoute?.domain ?? 'This domain'}</strong> has
						been validated. If it's not working right, try deleting it and
						adding it again.
					</P>
					<Button size="small" onClick={() => refetch()}>
						Check again
					</Button>
				</Box>
			:	<>
					<H3>Add your DNS record for {data?.domainRoute?.domain ?? '...'}</H3>
					<P>To validate your domain, add the following DNS records:</P>
					<DnsRecord {...tlsRecord} verified={status === 'MAIN_RECORD_SETUP'} />
					<DnsRecord {...mainRecord} verified={status === 'READY'} />
					<Box d="col" gap items="start">
						{note && <P>{note}</P>}
						<P>
							It can take up to 24 hours for your changes to take effect. Return
							to this menu any time to recheck your configuration.
						</P>
						<Button onClick={() => refetch()} color="primary">
							Check again now
						</Button>
					</Box>
				</>
			}
		</Box>
	);
}

function DnsRecord({
	type,
	name,
	value,
	verified,
}: {
	type: string;
	name: string;
	value: string;
	verified?: boolean;
}) {
	return (
		<Box
			surface={verified ? 'accent' : 'default'}
			container
			border
			gap
			p="lg"
			d="col"
		>
			{verified && (
				<Icon
					name="check"
					className="color-accent-dark absolute top-2 right-2"
				/>
			)}
			<Box gap>
				<span className="font-bold">Type:</span>
				<span>{type}</span>
			</Box>
			<Box d="col" gap>
				<span className="font-bold">Host:</span>
				<CopyTextbox value={name} hideShare />
			</Box>
			<Box d="col" gap>
				<span className="font-bold">Target:</span>
				<CopyTextbox value={value} hideShare />
			</Box>
		</Box>
	);
}
