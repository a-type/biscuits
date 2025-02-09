import { hooks } from '@/hooks.js';
import { Box, IconName, ThemeName } from '@a-type/ui';
import { TagToggle } from '@biscuits/client';

export interface TagFilterProps {
	value: string[] | readonly string[];
	onToggle: (value: string) => void;
	className?: string;
}

export function TagFilter({ value, onToggle, className }: TagFilterProps) {
	const tags = hooks.useAllTags();

	return (
		<Box wrap gap="sm" className={className}>
			{tags.map((tag) => (
				<TagToggle
					key={tag.uid}
					name={tag.get('name')}
					onToggle={() => onToggle(tag.get('name'))}
					toggled={value.includes(tag.get('name'))}
					color={tag.get('color') as ThemeName | undefined}
					icon={tag.get('icon') as IconName | undefined}
				/>
			))}
		</Box>
	);
}
