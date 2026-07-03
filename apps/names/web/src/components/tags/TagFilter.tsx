import { hooks } from '@/hooks.js';
import { Box, IconName } from '@a-type/ui';
import { TagToggle } from '@biscuits/client';

export interface TagFilterProps {
	value: string[] | readonly string[];
	onToggle: (value: string) => void;
	className?: string;
	style?: React.CSSProperties;
}

export function TagFilter({
	value,
	onToggle,
	className,
	...rest
}: TagFilterProps) {
	const tags = hooks.useAllTags();

	return (
		<Box wrap gap="sm" className={className} {...rest}>
			{tags.map((tag) => (
				<TagToggle
					key={tag.uid}
					name={tag.get('name')}
					onToggle={() => onToggle(tag.get('name'))}
					toggled={value.includes(tag.get('name'))}
					color={tag.get('color') as string | undefined}
					icon={tag.get('icon') as IconName | undefined}
				/>
			))}
		</Box>
	);
}
