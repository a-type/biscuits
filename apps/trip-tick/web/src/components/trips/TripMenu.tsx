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
				<Button size="icon" color="ghost">
					<Icon name="dots" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="items-start">
				<DropdownMenuItem
					className="text-red"
					onClick={() => {
						client.trips.delete(trip.get('id'));
						navigate('/', { skipTransition: true });
						toast((t) => (
							<span className="flex gap-2 items-center">
								<Icon name="check" />
								<span>Trip deleted!</span>
								<Button
									size="small"
									onClick={() => {
										client.undoHistory.undo();
										toast.dismiss(t.id);
									}}
								>
									Undo
								</Button>
							</span>
						));
					}}
				>
					Delete trip
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
