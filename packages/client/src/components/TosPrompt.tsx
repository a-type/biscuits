import {
  Dialog,
  DialogActions,
  DialogContent,
} from '@a-type/ui/components/dialog';
import { CONFIG, LogoutButton, graphql, useMe, useMutation } from '../index.js';
import { Button } from '@a-type/ui/components/button';
import { TOS_UPDATED_AT } from '../tos.js';

const acceptTosMutation = graphql(`
  mutation AcceptTos {
    acceptTermsOfService {
      id
      acceptedTermsOfServiceAt
    }
  }
`);

export function TosPrompt() {
  const { data } = useMe();
  const [acceptTos] = useMutation(acceptTosMutation);

  if (!data?.me) {
    return null;
  }

  const needsToUpdateTos =
    !data.me.acceptedTermsOfServiceAt ||
    new Date(data.me.acceptedTermsOfServiceAt) < TOS_UPDATED_AT;

  return (
    <Dialog open={needsToUpdateTos}>
      <DialogContent>
        <h1>Terms of Service Update</h1>
        <p>
          We&apos;ve updated our terms of service. Please review and accept to
          continue using Biscuits apps.
        </p>
        <div className="flex flex-col items-start gap-2">
          <Button asChild color="ghost">
            <a href={`${CONFIG.HOME_ORIGIN}/tos`} target="_blank">
              Terms of Service
            </a>
          </Button>
          <Button asChild color="ghost">
            <a href={`${CONFIG.HOME_ORIGIN}/privacy`} target="_blank">
              Privacy Policy
            </a>
          </Button>
        </div>
        <DialogActions>
          <Button asChild>
            <a href={`${CONFIG.HOME_ORIGIN}/plan`} target="_blank">
              Manage Plan or Log Out
            </a>
          </Button>
          <Button color="primary" onClick={() => acceptTos()}>
            Accept
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
