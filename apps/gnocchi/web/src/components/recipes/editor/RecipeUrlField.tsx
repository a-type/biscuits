import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Button } from '@a-type/ui/components/button';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { useState } from 'react';
import { useHasServerAccess } from '@biscuits/client';

export interface RecipeUrlFieldProps {
  recipe: Recipe;
}

export function RecipeUrlField({ recipe }: RecipeUrlFieldProps) {
  const { url } = hooks.useWatch(recipe);
  const [scanning, setScanning] = useState(false);
  const isSubscribed = useHasServerAccess();
  const updateRecipeFromUrl = hooks.useUpdateRecipeFromUrl();

  const scan = async () => {
    if (url) {
      try {
        setScanning(true);
        await updateRecipeFromUrl(recipe, url);
      } finally {
        setScanning(false);
      }
    }
  };

  return (
    <div className="flex gap-2 self-stretch w-full">
      <LiveUpdateTextField
        placeholder="Source URL"
        value={url || ''}
        onChange={(url) => recipe.set('url', url)}
        type="url"
        className="flex-1"
      />
      {isSubscribed && url && (
        <Button color="primary" onClick={scan} disabled={!url || scanning}>
          <Icon name="scan" style={{ width: 15, height: 15 }} />
          <span className="ml-2">Scan</span>
        </Button>
      )}
    </div>
  );
}
