import { Box, Button, CollapsibleSimple, Icon } from '@a-type/ui';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarCreateProps {}

export function SuperBarCreate({}: SuperBarCreateProps) {
	const { inputValue, createNew, loading } = useSuperBar();

	return (
		<CollapsibleSimple open={!!inputValue} className="w-full">
			<Box d="col" gap="xs" surface="primary" className="rounded-none">
				<Button
					color="ghost"
					className="w-full justify-center text-wrap rounded-none justify-between gap-sm [--focus:var(--color-primary-dark)]"
					loading={loading}
					onClick={() => {
						createNew();
					}}
				>
					Create "{inputValue}"
					<Box gap="xs" border className="px-md py-xs color-primary-dark">
						<span className="text-xs font-mono">Enter</span>
						<Icon name="enterKey" className="ml-auto" />
					</Box>
				</Button>
			</Box>
		</CollapsibleSimple>
	);
}
