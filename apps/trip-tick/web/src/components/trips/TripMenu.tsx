import { hooks } from '@/store.js';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon,
	toast,
} from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';

export interface TripMenuProps {
	tripId: string;
}

export function TripMenu({ tripId }: TripMenuProps) {
	const trip = hooks.useTrip(tripId);
	const client = hooks.useClient();
	const navigate = useNavigate();

	if (!trip) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button emphasis="ghost">
					<Icon name="dots" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="items-start">
				<DropdownMenuItem
					className="text-red"
					onClick={() => {
						client.trips.delete(trip.get('id'));
						navigate('/', { skipTransition: true });
						const id = toast.success('Trip deleted', {
							data: {
								actions: [
									{
										label: 'Undo',
										onClick: () => {
											client.undoHistory.undo();
											toast.update(id, 'Trip restored', {
												type: 'success',
											});
										},
									},
								],
							},
						});
					}}
				>
					Delete trip
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
