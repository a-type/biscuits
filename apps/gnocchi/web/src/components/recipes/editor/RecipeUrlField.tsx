import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button, Dialog, LiveUpdateTextField } from '@a-type/ui';
import { LoginButton, useIsLoggedIn } from '@biscuits/client';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useState } from 'react';

export interface RecipeUrlFieldProps {
	recipe: Recipe;
}

export function RecipeUrlField({ recipe }: RecipeUrlFieldProps) {
	const { url } = hooks.useWatch(recipe);
	const [initialUrl] = useState(() => recipe.get('url'));
	const [scanning, setScanning] = useState(false);
	const isLoggedIn = useIsLoggedIn();
	const updateRecipeFromUrl = hooks.useUpdateRecipeFromUrl();

	const hasUrlChanged = url !== initialUrl;
	const showScan = hasUrlChanged || !url;

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
				placeholder="Paste a website"
				value={url || ''}
				onChange={(url) => recipe.set('url', url)}
				type="url"
				className="flex-1"
				autoSelect
			/>
			{showScan &&
				(isLoggedIn ? (
					<Button color="primary" onClick={scan} disabled={!url || scanning}>
						<Icon name="scan" style={{ width: 15, height: 15 }} />
						<span className="ml-2">Scan</span>
					</Button>
				) : (
					<Dialog>
						<Dialog.Trigger asChild>
							<Button color="primary">
								<Icon name="scan" style={{ width: 15, height: 15 }} />
								<span className="ml-2">Scan</span>
							</Button>
						</Dialog.Trigger>
						<Dialog.Content>
							<Dialog.Title>Sign up to scan</Dialog.Title>
							<Dialog.Description>
								Get a free account to begin scanning web recipes. Free users get
								5 recipes per month.
							</Dialog.Description>
							<Dialog.Actions>
								<Dialog.Close>Cancel</Dialog.Close>
								<LoginButton color="primary" asChild returnTo="/">
									Get started
								</LoginButton>
							</Dialog.Actions>
						</Dialog.Content>
					</Dialog>
				))}
		</div>
	);
}
