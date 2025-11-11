import { Avatar, AvatarList, AvatarListItem, ErrorBoundary } from '@a-type/ui';
import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { UserInfo } from '@verdant-web/store';
import { useContext, useSyncExternalStore } from 'react';
import { VerdantContext } from '../verdant.js';

const EMPTY_PEERS = {} as Record<string, UserInfo<BiscuitsVerdantProfile, any>>;

export function PresencePeople({
	hideIfAlone,
	avatarClassName,
}: {
	hideIfAlone?: boolean;
	avatarClassName?: string;
}) {
	const client = useContext(VerdantContext);
	const syncing = useSyncExternalStore(
		(onChange) =>
			client?.sync.subscribe('onlineChange', onChange) ?? (() => {}),
		() => client?.sync.isConnected,
	);
	const peersMap = useSyncExternalStore(
		(onChange) =>
			client?.sync.presence.subscribe('peersChanged', onChange) ?? (() => {}),
		() => client?.sync.presence.peers ?? EMPTY_PEERS,
	);
	const peers = Object.values(peersMap);
	const self = useSyncExternalStore(
		(onChange) =>
			client?.sync.presence.subscribe('selfChanged', onChange) ?? (() => {}),
		() => client?.sync.presence.self,
	);

	if (!syncing || (hideIfAlone && peers.length === 0)) {
		return <Avatar />;
	}

	return (
		<ErrorBoundary>
			<AvatarList count={peers.length + 1}>
				{peers.map((peer, index) => (
					<AvatarListItem
						key={peer.profile.id}
						index={index}
						imageSrc={peer.profile.imageUrl ?? undefined}
						name={peer.profile.name}
						className={avatarClassName}
					/>
				))}
				<AvatarListItem
					index={peers.length}
					imageSrc={self?.profile.imageUrl ?? undefined}
					name={self?.profile.name}
					className={avatarClassName}
					popIn={false}
				/>
			</AvatarList>
		</ErrorBoundary>
	);
}
