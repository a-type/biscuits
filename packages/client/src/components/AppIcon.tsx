import { useAppInfo } from '../react.js';

export interface AppIconProps {
  className?: string;
}

export function AppIcon({ className, ...rest }: AppIconProps) {
  const app = useAppInfo();

  return (
    <img
      src={app.iconPath}
      className={className ?? 'w-12'}
      alt={app.name + ' icon'}
      {...rest}
    />
  );
}
