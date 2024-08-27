import { graphql, useMutation, useSuspenseQuery } from '@biscuits/graphql';
import { Switch } from '@a-type/ui/components/switch';

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
		<label className="flex flex-row gap-3 text-sm transition-color p-2 rounded-lg w-full border-1 border-solid border-default rounded-lg">
			<Switch
				checked={data.me.sendEmailUpdates}
				onCheckedChange={(v) => setValue({ variables: { enabled: !!v } })}
			/>
			<div className="flex flex-col gap-2 items-stretch flex-1 mt-1">
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
		</label>
	);
}
