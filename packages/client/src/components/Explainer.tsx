import { Button } from '@a-type/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogClose,
} from '@a-type/ui/components/dialog';
import { useLocalStorage } from '../hooks/useStorage.js';
import { ReactNode, useState } from 'react';

export interface ExplainerProps {
  stages: ReactNode[];
}

export function Explainer({ stages }: ExplainerProps) {
  const [explainerDismissed, setExplainerDismissed] = useLocalStorage(
    'explainerDismissed',
    false,
  );
  const [stage, setStage] = useState(0);
  return (
    <Dialog
      open={!explainerDismissed}
      onOpenChange={(open) => {
        if (!open) {
          setExplainerDismissed(true);
        }
      }}
    >
      <DialogContent
        outerClassName="h-screen max-h-none sm:max-h-[80vh] overflow-y-auto"
        className="h-screen sm:h-auto"
      >
        <div className="col gap-4 flex-1 items-start">{stages[stage]}</div>
        <DialogActions>
          <DialogClose asChild>
            <Button>Skip</Button>
          </DialogClose>
          <Button
            className="ml-auto"
            color="primary"
            onClick={() => {
              if (stage === stages.length - 1) {
                setExplainerDismissed(true);
              } else {
                setStage(stage + 1);
              }
            }}
          >
            {stage === stages.length - 1 ? 'Got it!' : 'Next'}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
