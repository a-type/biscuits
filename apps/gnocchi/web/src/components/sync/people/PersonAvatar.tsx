import { Profile } from '@/stores/groceries/index.js';
import { Avatar } from '@a-type/ui';
import { UserInfo } from '@gnocchi.biscuits/verdant';
import { CSSProperties } from 'react';

export function PersonAvatar({
	person,
	className,
	...rest
}: {
	person: UserInfo<Profile, any> | null;
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<Avatar
			imageSrc={person?.profile.imageUrl}
			name={person?.profile.name}
			className={className}
			{...rest}
		/>
	);
}
