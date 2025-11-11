import { ConfirmedButton } from '@a-type/ui';
import { useHasServerAccess } from '../hooks/graphql.js';

export function ResetToServer({
	client,
}: {
	client: { __dangerous__resetLocal: () => void };
}) {
	const canSync = useHasServerAccess();

	if (!canSync) return null;

	return (
		<ConfirmedButton
			emphasis="primary"
			color="attention"
			confirmText="This will reset your local data to the server's version."
			onConfirm={() => {
				client.__dangerous__resetLocal();
			}}
		>
			Reset local data
		</ConfirmedButton>
	);
}
