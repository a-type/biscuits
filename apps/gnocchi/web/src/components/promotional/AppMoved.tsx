import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@a-type/ui/components/dialog';
import { P } from '@a-type/ui/components/typography';
import {
  CONFIG,
  LoginButton,
  getIsPWAInstalled,
  getOS,
  useAppInfo,
  useCanSync,
} from '@biscuits/client';
import { Link } from '@verdant-web/react-router';
import { Icon } from '@a-type/ui/components/icon';
import { toast } from 'react-hot-toast';
import { Button } from '@a-type/ui/components/button';
import { ExportDataButton } from '@biscuits/client/storage';

export interface AppMovedProps {}

export function AppMoved({}: AppMovedProps) {
  const canSync = useCanSync();
  const app = useAppInfo();

  if (
    window.location.origin === app.url ||
    window.location.origin === app.devOriginOverride
  ) {
    return null;
  }

  const goTo = new URL(app.url);
  if (!canSync) {
    goTo.search = '?transfer=true';
  }

  return (
    <Dialog open>
      <DialogContent className="gap-3">
        <DialogTitle>Gnocchi has moved</DialogTitle>
        <P>
          Sorry, I know this is annoying, but Gnocchi has moved to a new app to
          join{' '}
          <Link newTab to={CONFIG.HOME_ORIGIN} className="font-bold">
            Biscuits
          </Link>
          . You'll have to go there to use the app now.
        </P>
        {!canSync ? <LoggedOut /> : <LoggedIn />}
        <InstallNote />
        <DialogActions>
          <Button asChild>
            <Link to={`${CONFIG.HOME_ORIGIN}/contact`} newTab>
              Contact Support
            </Link>
          </Button>
          <Button asChild color="primary">
            <Link newTab to={goTo.toString()}>
              Open Gnocchi
            </Link>
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

function LoggedOut() {
  if (getOS() === 'iOS' && getIsPWAInstalled()) {
    return (
      <div className="col">
        <P>
          You're not currently logged in to sync. If you have a subscription,
          log in now so your data syncs to the new app.
        </P>
        <LoginButton />
        <P>
          If you don't have a sync subscription, you can export your data now
          and import it into the new app (click the <Icon name="gear" /> in the
          top right after opening the new app).
        </P>
        <ExportDataButton onError={(e) => toast.error(e.message)} />
      </div>
    );
  } else {
    return (
      <div className="col">
        <P>
          Your data should transfer automatically when you open the new app. If
          that doesn't seem to work, come back to this app and export your data
          as a file. You can then use the <Icon name="gear" /> settings menu in
          the new app to import the file.
        </P>
        <ExportDataButton onError={(e) => toast.error(e.message)} />
      </div>
    );
  }
}

function LoggedIn() {
  return (
    <P>
      Since you're logged into sync, all your data will be available in the new
      app automatically. Just click the button below to open the new app.
    </P>
  );
}

function InstallNote() {
  const os = getOS();
  if (os === 'iOS') {
    return (
      <div>
        Open the new app in Safari to add it to your home screen again. If
        you've already installed the new app, you can uninstall this one.
      </div>
    );
  } else if (os === 'Android') {
    return (
      <div>
        Open the new app in Chrome and add it to your home screen again. If
        you've already installed the new app, you can uninstall this one.
      </div>
    );
  }
  return null;
}
