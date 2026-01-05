import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Icon,
	Select,
	SelectTrigger,
	UnstyledSelectTrigger,
} from '@a-type/ui';
import classNames from 'classnames';
import { ReactNode, useCallback, useEffect } from 'react';

export interface MeetupSelectProps {
	children?: (value: string | undefined) => ReactNode;
	id?: string;
	emptyLabel?: string;
}

export function MeetupSelect({ children, id, emptyLabel }: MeetupSelectProps) {
	const client = hooks.useClient();
	const info = hooks.useCollaborationInfo('default');
	hooks.useWatch(info);
	const meetup = info?.get('meetup') ?? null;
	hooks.useWatch(meetup);

	useEffect(() => {
		if (!info) {
			client.collaborationInfo.put({});
		}
	}, [info, client]);

	let location = meetup?.get('location');
	const createdAt = meetup?.get('createdAt') || 0;
	if (createdAt < Date.now() - 1000 * 60 * 60) {
		location = undefined;
	}

	const categories = hooks.useAllCategories();
	const options = categories.map((cat) => cat.get('name'));

	const setMeetup = useCallback(
		(value: string | null) => {
			if (value === 'clear' || !value) {
				info?.set('meetup', null);
			} else {
				client
					.batch({ undoable: false })
					.run(() => {
						info?.set('meetup', {
							location: value,
						});
					})
					.commit();
			}
		},
		[info, client],
	);

	const Trigger = children ? UnstyledSelectTrigger : SelectTrigger;

	return (
		<Select
			value={location || 'clear'}
			onValueChange={(v) => {
				setMeetup(v);
			}}
		>
			<Trigger
				render={<Button />}
				className={classNames(
					!children && 'py-3 px-6',
					!!location && 'bg-accent-wash color-accent-dark',
				)}
				id={id}
			>
				{children ? (
					children(location)
				) : (
					<Button>
						<Icon name="locate" />
						<Select.Value />
						<Select.Icon />
					</Button>
				)}
			</Trigger>
			<Select.Content>
				<Select.Item value={null}>
					{location ? 'Clear' : emptyLabel || 'Regroup'}
				</Select.Item>
				<Select.Group>
					<Select.GroupLabel>Choose a location</Select.GroupLabel>
					<Select.Item value="Checkout Lanes">Checkout Lanes</Select.Item>
					<Select.Item value="Self Checkout">Self Checkout</Select.Item>
					{options.map((option) => (
						<Select.Item value={option} key={option}>
							{option}
						</Select.Item>
					))}
				</Select.Group>
			</Select.Content>
		</Select>
	);
}
