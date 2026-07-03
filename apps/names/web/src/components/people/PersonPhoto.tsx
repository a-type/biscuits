import { hooks } from '@/hooks.js';
import { ImageUploader } from '@a-type/ui';
import { Person } from '@names.biscuits/verdant';

export interface PersonPhotoProps {
	person: Person;
	className?: string;
}

export function PersonPhoto({ person, className }: PersonPhotoProps) {
	const { photo } = hooks.useWatch(person);
	const photoUrl = hooks.useWatch(photo);

	return (
		<ImageUploader
			style={{
				minHeight: 160,
				maxHeight: '50vh',
				width: '100%',
				aspectRatio: photoUrl ? '1 / 1' : undefined,
			}}
			className={className}
			value={photoUrl}
			onChange={(v) => person.set('photo', v)}
			facingMode="environment"
		/>
	);
}
