import { Box, Button, CollapsibleSimple, Icon } from '@a-type/ui';
import { useSuperBar } from './SuperBarContext.jsx';
import cls from './SuperBarCreate.module.css';

export interface SuperBarCreateProps {}

export function SuperBarCreate({}: SuperBarCreateProps) {
	const { inputValue, createNew, loading } = useSuperBar();

	return (
		<CollapsibleSimple open={!!inputValue} className="w-full">
			<Box col gap="xs" surface="secondary" round={false}>
				<Button
					emphasis="ghost"
					full="width"
					className={cls.button}
					loading={loading}
					onClick={() => {
						createNew();
					}}
				>
					Create "{inputValue}"
					<Box gap="xs" border surface="primary" className={cls.kbd}>
						<span>Enter</span>
						<Icon name="enterKey" className={cls.icon} />
					</Box>
				</Button>
			</Box>
		</CollapsibleSimple>
	);
}
