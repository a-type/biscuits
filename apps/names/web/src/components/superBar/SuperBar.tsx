import { Input } from '@a-type/ui';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarProps {
	className?: string;
}

export function SuperBar({ className }: SuperBarProps) {
	const { getInputProps } = useSuperBar();

	return <Input {...getInputProps({ className })} />;
}
