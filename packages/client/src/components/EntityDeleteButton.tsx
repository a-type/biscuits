import { Box, Button, ButtonProps, Icon, toast } from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';
import { ObjectEntity } from '@verdant-web/store';
import { useContext } from 'react';
import { VerdantContext } from '../verdant.js';

export interface EntityDeleteButtonProps extends ButtonProps {
	entity: ObjectEntity<any, any>;
	redirectTo?: string;
	entityName?: string;
}

export function EntityDeleteButton({
	entity,
	redirectTo,
	children,
	entityName = 'Item',
	onClick,
	...rest
}: EntityDeleteButtonProps) {
	const navigate = useNavigate();
	const desc = useContext(VerdantContext);

	return (
		<Button
			color="destructive"
			{...rest}
			onClick={(ev) => {
				entity.deleteSelf();
				if (redirectTo) {
					navigate(redirectTo);
				}
				const id = toast(
					<Box gap items="center">
						<span>{entityName} deleted</span>
						<Button
							size="small"
							onClick={() => {
								const client = desc?.current;
								if (client) {
									client.undoHistory.undo();
									toast.dismiss(id);
									toast(`Restored ${entityName}`, {
										duration: 5000,
									});
								} else {
									toast.error('Could not restore item');
								}
							}}
						>
							Undo
						</Button>
					</Box>,
					{
						duration: 10000,
					},
				);
				onClick?.(ev);
			}}
		>
			{children || (
				<>
					<Icon name="trash" />
					<span>Delete {entityName}</span>
				</>
			)}
		</Button>
	);
}
