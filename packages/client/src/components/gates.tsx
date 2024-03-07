import { ReactNode } from 'react';
import { useCanSync } from '../index.js';

export interface GateProps {
  children?: ReactNode;
}

export function SubscribedOnly({ children }: GateProps) {
  const isSubscribed = useCanSync();

  if (!isSubscribed) {
    return null;
  }

  return <>{children}</>;
}

export function UnsubscribedOnly({ children }: GateProps) {
  const isSubscribed = useCanSync();

  if (isSubscribed) {
    return null;
  }

  return <>{children}</>;
}
