import { hooks } from '@/hooks.js';
import {
	Button,
	Card,
	FormikForm,
	Icon,
	TextField,
	withClassName,
} from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';
import { authorization, List, ListInit } from '@wish-wash.biscuits/verdant';
import { useState } from 'react';

export interface CreateListOptionsProps {
	onCreated?: (list: List) => void;
	onStageChange?: (stage: 'type' | 'who') => void;
}

export function CreateListOptions({
	onCreated,
	onStageChange,
}: CreateListOptionsProps) {
	const [stage, _setStage] = useState<'type' | 'who'>('type');
	const setStage = (stage: 'type' | 'who') => {
		_setStage(stage);
		onStageChange?.(stage);
	};
	const client = hooks.useClient();
	const navigate = useNavigate();

	const createList = async (
		name: string,
		type: ListInit['type'],
		access?: (typeof authorization)['private'],
	) => {
		const list = await client.lists.put({ name, type }, { access });
		navigate(`/${list.get('id')}`);
		setStage('type');
		onCreated?.(list);
	};

	const canSync = useHasServerAccess();

	return (
		<>
			{stage === 'who' ?
				<>
					<FormikForm
						initialValues={{ name: '' }}
						onSubmit={(values) =>
							createList(`Ideas for ${values.name}`, 'ideas')
						}
						className="w-full"
					>
						<TextField
							autoFocus
							name="name"
							label="Who are you buying for?"
							required
							className="w-full"
						/>
						<div className="row w-full justify-between">
							<Button type="button" onClick={() => setStage('type')}>
								<Icon name="arrowLeft" />
								Back
							</Button>
							<Button color="primary" type="submit">
								Create
							</Button>
						</div>
					</FormikForm>
				</>
			:	<>
					<div className="grid grid-cols-2 items-stretch justify-stretch gap-3">
						{canSync && (
							<Card className="h-full">
								<Card.Main
									onClick={() => createList('Our shopping list', 'shopping')}
								>
									<Card.Title>
										<Icon name="refresh" /> Shared Shopping List
										{!canSync && <PremiumBadge>Members Only</PremiumBadge>}
									</Card.Title>
									<Card.Content>
										Keep your family on the same page about things you need.
									</Card.Content>
								</Card.Main>
							</Card>
						)}
						<Card className="h-full">
							<Card.Main
								onClick={() =>
									createList(
										'My shopping list',
										'shopping',
										authorization.private,
									)
								}
							>
								<Card.Title>
									<Icon name="lock" /> Private Shopping List
								</Card.Title>
								<Card.Content>
									Keep track of stuff you want to buy for yourself.
								</Card.Content>
							</Card.Main>
						</Card>
						<Card className="h-full">
							<Card.Main
								onClick={() => {
									createList('My wish list', 'wishlist', authorization.private);
								}}
							>
								<Card.Title>
									<Icon name="gift" /> Personal Wish List
								</Card.Title>
								<Card.Content>
									Make a wish list to share with others.
								</Card.Content>
							</Card.Main>
						</Card>
						<Card className="h-full">
							<Card.Main onClick={() => setStage('who')}>
								<Card.Title>
									<Icon name="lightbulb" /> Idea List
								</Card.Title>
								<Card.Content>
									Save your gift ideas for someone else
								</Card.Content>
							</Card.Main>
						</Card>
					</div>
				</>
			}
		</>
	);
}

const PremiumBadge = withClassName(
	'div',
	'text-xs font-bold text-accent-dark bg-accent-wash rounded-full py-1 px-4 border-accent-dark border-1 border-solid',
);
