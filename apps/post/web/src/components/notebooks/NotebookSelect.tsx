import { hooks } from '@/hooks.js';
import { Select, SelectProps } from '@a-type/ui';

export interface NotebookSelectProps
	extends Omit<SelectProps, 'value' | 'onValueChange'> {
	value: string | null;
	onValueChange: (id: string | null) => void;
}

export function NotebookSelect({
	value,
	onValueChange,
	...rest
}: NotebookSelectProps) {
	const notebooks = hooks.useAllNotebooks({
		index: {
			where: 'name',
			order: 'asc',
		},
	});

	return (
		<Select
			value={value || 'null'}
			onValueChange={(v) => {
				if (v === 'null') {
					onValueChange(null);
				} else {
					onValueChange(v);
				}
			}}
			{...rest}
		>
			<Select.Trigger size="small" />
			<Select.Content>
				<Select.Item value="null">Unsorted</Select.Item>
				{notebooks.map((notebook) => (
					<Select.Item key={notebook.get('id')} value={notebook.get('id')}>
						{notebook.get('name')}
					</Select.Item>
				))}
			</Select.Content>
		</Select>
	);
}
