import { hooks } from '@/stores/groceries/index.js';
import { useUpdateRecipeFromUrl } from '@/stores/groceries/mutations.js';
import { Button, Dialog, Icon, LiveUpdateTextField } from '@a-type/ui';
import { LoginButton, useIsLoggedIn } from '@biscuits/client';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useState } from 'react';

export interface RecipeUrlFieldProps {
	recipe: Recipe;
}

export function RecipeUrlField({ recipe }: RecipeUrlFieldProps) {
	const { url } = hooks.useWatch(recipe);
	const [scanning, setScanning] = useState(false);
	const [isLoggedIn] = useIsLoggedIn();
	const updateRecipeFromUrl = useUpdateRecipeFromUrl();

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
		<div className="w-full flex self-stretch gap-2">
			<LiveUpdateTextField
				placeholder="Paste a website"
				value={url || ''}
				onChange={(url) => recipe.set('url', url)}
				type="url"
				className="flex-1"
				autoSelect
			/>
			{isLoggedIn ? (
				<Button emphasis="primary" onClick={scan} disabled={!url || scanning}>
					<Icon name="scan" style={{ width: 15, height: 15 }} />
					<span className="ml-2">Scan</span>
				</Button>
			) : (
				<Dialog>
					<Dialog.Trigger render={<Button emphasis="primary" />}>
						<Icon name="scan" style={{ width: 15, height: 15 }} />
						<span className="ml-2">Scan</span>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Title>Sign up to scan web recipes</Dialog.Title>
						<Dialog.Description>
							Get a free account to begin scanning web recipes. Free users get 5
							recipes per month.
						</Dialog.Description>
						<Dialog.Actions>
							<Dialog.Close>Cancel</Dialog.Close>
							<LoginButton emphasis="primary" returnTo="/">
								Get started
							</LoginButton>
						</Dialog.Actions>
					</Dialog.Content>
				</Dialog>
			)}
		</div>
	);
}
