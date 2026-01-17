import { hooks } from '@/hooks.js';
import { clsx, ImageUploader } from '@a-type/ui';
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
			className={clsx('min-h-160px w-full', photoUrl && 'aspect-1', className)}
			value={photoUrl}
			onChange={(v) => person.set('photo', v)}
			facingMode="environment"
		/>
	);
}
