import { Profile } from '@/stores/groceries/index.js';
import { Icon } from '@a-type/ui';
import { UserInfo } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import { CSSProperties } from 'react';

export function PersonAvatar({
	person,
	className,
	popIn = true,
	...rest
}: {
	person: UserInfo<Profile, any> | null;
	className?: string;
	popIn?: boolean;
	style?: CSSProperties;
}) {
	return (
		<div
			data-pop={popIn}
			className={classNames(
				'layer-components:(relative h-24px w-24px flex flex-shrink-0 select-none items-center justify-center overflow-hidden border-default rounded-full bg-white)',
				popIn &&
					'layer-variants:(animate-pop-in-from-half animate-duration-200 animate-ease-springy)',
				!person && 'layer-components(border-dashed bg-gray2)',
				className,
			)}
			{...rest}
		>
			{person && <AvatarContent user={person} />}
			{!person && <Icon name="profile" />}
		</div>
	);
}

function AvatarContent({ user }: { user: UserInfo<Profile, any> }) {
	if (user.profile?.imageUrl) {
		return (
			<img
				className="h-full w-full rounded-full object-cover"
				referrerPolicy="no-referrer"
				crossOrigin="anonymous"
				src={user.profile.imageUrl}
			/>
		);
	}
	return (
		<div className="flex items-center justify-center rounded-full text-sm font-bold color-black">
			{user.profile.name?.charAt(0) || '?'}
		</div>
	);
}
