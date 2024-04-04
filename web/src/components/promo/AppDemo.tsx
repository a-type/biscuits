import './phone.css';
import { AppId, appsById, getAppUrl } from '@biscuits/apps';
import PhoneDemo from './PhoneDemo.jsx';
import { Button } from '@a-type/ui/components/button';
import classNames from 'classnames';

export interface AppDemoProps {
  appId: AppId;
  index: number;
}

export function AppDemo({ appId, index }: AppDemoProps) {
  const app = appsById[appId];

  const url = getAppUrl(app);

  return (
    <div className="flex flex-row gap-8 items-center even:(flex-row-reverse)">
      <div
        className={classNames(
          'flex-shrink-0 w-1/2 flex flex-col',
          index % 2 === 1 ? 'items-start' : 'items-end text-end',
        )}
      >
        <img
          src={`${url}/${app.iconPath}`}
          alt={app.name}
          className="h-auto rounded-lg w-[120px] h-[120px] object-contain object-center"
        />
        <h3 className="text-2xl font-bold">{app.name}</h3>
        <p className="text-lg">{app.description}</p>
        <Button asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open app
          </a>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <PhoneDemo src={app.demoVideoSrc} />
      </div>
    </div>
  );
}
