import { Box, Heading, P } from '@a-type/ui';
import { useContext } from 'react';
import { BugButton } from '../common/BugButton.js';
import {
	LinkButton,
	ReloadButton,
	SubscribedOnly,
	useHadRecentError,
} from '../react.js';
import { VerdantContext } from '../verdant.js';
import { ResetToServer } from './ResetToServer.js';

export function GlobalErrorFallback({
	clearError,
}: {
	clearError?: () => void;
}) {
	const hadRecentError = useHadRecentError();
	const verdant = useContext(VerdantContext);

	return (
		<Box col layout="center center" p>
			<Box
				col
				items="start"
				justify="center"
				gap
				style={{ maxWidth: 'max-content' }}
			>
				<Heading emphasis="primary" render={<h1 />}>
					Something went wrong
				</Heading>
				<P>
					Sorry about this. The app has crashed.{' '}
					{hadRecentError ?
						`Looks like refreshing didn't work either... I recommend reporting a bug using the button below.`
					:	`You can try refreshing, but if
					that doesn't work, use the button below to report the issue.`
					}
				</P>
				<LinkButton to="/" onClick={clearError}>
					Go Home
				</LinkButton>
				<ReloadButton />
				<BugButton />
				{hadRecentError && verdant && (
					<SubscribedOnly>
						<ResetToServer client={verdant} />
					</SubscribedOnly>
				)}
			</Box>
		</Box>
	);
}
