import { hooks } from '@/hooks.js';
import { Button, ButtonProps } from '@a-type/ui';
import { useNavigate } from '@biscuits/client';

export interface CreateFloorButtonProps extends ButtonProps {}
export function CreateFloorButton({
	children,
	onClick,
	...rest
}: CreateFloorButtonProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<Button
			onClick={async (ev) => {
				const floor = await client.floors.put({ name: 'New Floor' });
				onClick?.(ev);
				navigate({
					to: '/floors/$floorId',
					params: { floorId: floor.get('id') },
				});
			}}
			{...rest}
		>
			{children || 'New Floor'}
		</Button>
	);
}
