import { hooks } from '@/store.js';
import { Avatar, clsx } from '@a-type/ui';
import { animated, useSpring } from '@react-spring/web';
import { useEffect, useMemo } from 'react';

export interface CursorProps {
	userId: string;
}

export function Cursor({ userId }: CursorProps) {
	const client = hooks.useClient();

	const color = useMemo(
		() =>
			['lemon', 'tomato', 'leek', 'blueberry', 'eggplant'][
				Math.floor(Math.random() * 5)
			],
		[],
	);

	const [style, spring] = useSpring(() => ({
		x: 0,
		y: 0,
		opacity: 0,
	}));

	const profile = client.sync.presence.peers[userId]?.profile;

	useEffect(() => {
		return client.sync.presence.subscribe(
			'peerChanged',
			(peerId, { presence }) => {
				if (userId !== peerId) return;
				if (!presence.cursorPosition) return;

				spring.start({
					x: presence.cursorPosition.x,
					y: presence.cursorPosition.y,
					opacity: presence.cursorActive ? 1 : 0,
				});
			},
		);
	}, [spring, userId, client]);

	return (
		<animated.div
			className={clsx(
				'absolute flex flex-row items-start transform-origin-tl',
				`theme-${color}`,
			)}
			style={{
				x: style.x,
				y: style.y,
				opacity: style.opacity,
				scale: 'calc(1/(var(--zoom,1)))',
			}}
		>
			<CursorGraphic />
			<div className="ml-2 text-xs color-white bg-primary rounded-full px-2 py-1 row shadow-lg">
				{profile.imageUrl && (
					<Avatar className="w-12px h-12px" imageSrc={profile.imageUrl} />
				)}
				<span className="text-xs">{profile?.name}</span>
			</div>
		</animated.div>
	);
}

function CursorGraphic() {
	return (
		<div className="border-6px border-solid border-t-primary border-l-primary border-r-transparent border-b-transparent" />
	);
}
