import { Box, Switch } from '@a-type/ui';
import { useMutation, useSuspenseQuery } from '@biscuits/graphql';
import { graphql } from '../../graphql.js';

export interface EmailUpdatesToggleProps {
	isSubscribed?: boolean;
}

const hasEnabledUpdates = graphql(`
	query HasEnabledUpdates {
		me {
			id
			sendEmailUpdates
		}
	}
`);

const setEnabled = graphql(`
	mutation SetEmailUpdates($enabled: Boolean!) {
		setSendEmailUpdates(value: $enabled) {
			id
			sendEmailUpdates
		}
	}
`);

export function EmailUpdatesToggle({ isSubscribed }: EmailUpdatesToggleProps) {
	const { data } = useSuspenseQuery(hasEnabledUpdates);
	const [setValue] = useMutation(setEnabled);

	return (
		<Box
			render={<label />}
			border
			p
			surface
			color={data.me.sendEmailUpdates ? 'accent' : 'gray'}
			full="width"
			gap
			className="text-sm transition-color"
		>
			<Switch
				checked={data.me.sendEmailUpdates}
				onCheckedChange={(v) => setValue({ variables: { enabled: !!v } })}
			/>
			<div className="mt-1 flex flex-1 flex-col items-stretch gap-2">
				<div>
					Send me an email when a new Biscuits app launches or significant
					features are added
				</div>
				{isSubscribed && (
					<div className="font-bold">
						As a Biscuits subscriber, you get full access to all features on new
						apps. This lets you know that new stuff is available!
					</div>
				)}
			</div>
		</Box>
	);
}
