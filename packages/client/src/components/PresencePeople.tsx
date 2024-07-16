import {
  Avatar,
  AvatarList,
  AvatarListItem,
} from '@a-type/ui/components/avatar';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { useContext, useSyncExternalStore } from 'react';
import { VerdantContext, VerdantProfile } from '../index.js';
import { UserInfo } from '@verdant-web/store';

const EMPTY_PEERS = {} as Record<string, UserInfo<VerdantProfile, any>>;

export function PresencePeople({
  hideIfAlone,
  avatarClassName,
}: {
  hideIfAlone?: boolean;
  avatarClassName?: string;
}) {
  const desc = useContext(VerdantContext);
  const client = desc?.current;
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
            imageSrc={peer.profile.imageUrl}
            name={peer.profile.name}
            className={avatarClassName}
          />
        ))}
        <AvatarListItem
          index={peers.length}
          imageSrc={self?.profile.imageUrl}
          name={self?.profile.name}
          className={avatarClassName}
          popIn={false}
        />
      </AvatarList>
    </ErrorBoundary>
  );
}
