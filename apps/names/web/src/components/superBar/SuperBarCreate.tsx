import { Box, Button, CollapsibleSimple, Icon } from '@a-type/ui';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarCreateProps {}

export function SuperBarCreate({}: SuperBarCreateProps) {
	const { inputValue, createNew, loading } = useSuperBar();

	return (
		<CollapsibleSimple open={!!inputValue} className="w-full">
			<Box col gap="xs" surface color="primary" className="rounded-none">
				<Button
					emphasis="ghost"
					className="[--focus:var(--color-primary-dark)] w-full justify-center justify-between gap-sm rounded-none text-wrap"
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
