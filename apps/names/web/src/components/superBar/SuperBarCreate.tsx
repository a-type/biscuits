import { Button, CollapsibleSimple, Icon, PageNowPlaying } from '@a-type/ui';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarCreateProps {}

export function SuperBarCreate({}: SuperBarCreateProps) {
	const { createNew, inputValue } = useSuperBar();

	return (
		<PageNowPlaying
			unstyled
			className="w-full flex items-center justify-center"
		>
			<CollapsibleSimple open={!!inputValue}>
				<Button color="primary" onClick={createNew}>
					<Icon name="add_person" />
					Create "{inputValue}"
				</Button>
			</CollapsibleSimple>
		</PageNowPlaying>
	);
}
