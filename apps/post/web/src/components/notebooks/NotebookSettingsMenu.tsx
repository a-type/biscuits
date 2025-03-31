import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	ButtonProps,
	clsx,
	ColorPicker,
	Dialog,
	Divider,
	H3,
	Icon,
	LiveUpdateTextField,
	P,
	ThemeName,
	tipTapClassName,
	tipTapReadonlyClassName,
	ToggleGroup,
} from '@a-type/ui';
import { DomainRouteView } from '@biscuits/client';
import { Notebook } from '@post.biscuits/verdant';

export interface NotebookSettingsMenuProps extends ButtonProps {
	notebook: Notebook;
}

export function NotebookSettingsMenu({
	children,
	notebook,
	...rest
}: NotebookSettingsMenuProps) {
	const { theme, name, publishedTitle } = hooks.useWatch(notebook);
	const { primaryColor, fontStyle, spacing } = hooks.useWatch(theme);
	return (
		<Dialog>
			<Dialog.Trigger asChild>
				<Button size="icon" {...rest}>
					{children || <Icon name="gear" />}
				</Button>
			</Dialog.Trigger>
			<Dialog.Content width="md">
				<Box d="col" gap>
					<Dialog.Title>Settings</Dialog.Title>
					<Box surface="accent" p d="col" gap="sm">
						These settings apply globally to all posts published in this
						notebook.
					</Box>
					<H3>Published title</H3>
					<P>
						Change the title that appears if you publish this notebook online.
					</P>
					<LiveUpdateTextField
						value={publishedTitle || name}
						onChange={(v) => notebook.set('publishedTitle', v)}
					/>
					<Divider />
					<H3>Styling</H3>
					<P>Customize the appearance of this notebook.</P>
					<Box
						d="col"
						border
						style={
							{
								'--global-spacing-scale':
									spacing === 'sm' ? '0.5'
									: spacing === 'lg' ? '2'
									: '1',
								'--font-default':
									fontStyle === 'sans-serif' ? 'var(--font-sans)' : (
										'var(--font-serif)'
									),
							} as any
						}
						className={clsx(
							`theme-${primaryColor} bg-wash p-8px font-default`,
							tipTapClassName,
							tipTapReadonlyClassName,
						)}
					>
						<div className=".ProseMirror">
							<h3>Preview</h3>
							<p>
								Preview of the <mark>current theme.</mark> The preview will
								update as you change the settings.
							</p>
							<p>Differences may be subtle!</p>
						</div>
					</Box>
					<Box gap items="center" justify="between">
						<span>Color</span>
						<ColorPicker
							onChange={(v) => theme.set('primaryColor', v as ThemeName)}
							value={primaryColor || 'blueberry'}
						/>
					</Box>
					<Box gap items="center" justify="between">
						<span>Font</span>
						<ToggleGroup
							type="single"
							value={fontStyle}
							onValueChange={(v) =>
								theme.set('fontStyle', v as 'sans-serif' | 'serif')
							}
						>
							<ToggleGroup.Item value="sans-serif">Sans-serif</ToggleGroup.Item>
							<ToggleGroup.Item value="serif">Serif</ToggleGroup.Item>
						</ToggleGroup>
					</Box>
					<Box gap items="center" justify="between">
						<span>Spacing</span>
						<ToggleGroup
							type="single"
							value={spacing}
							onValueChange={(v) =>
								theme.set('spacing', v as 'sm' | 'md' | 'lg')
							}
						>
							<ToggleGroup.Item value="sm">Tight</ToggleGroup.Item>
							<ToggleGroup.Item value="md">Regular</ToggleGroup.Item>
							<ToggleGroup.Item value="lg">Loose</ToggleGroup.Item>
						</ToggleGroup>
					</Box>
					<Divider />
					<H3>Domain</H3>
					<P>You can assign a custom domain you own to this notebook.</P>
					<DomainRouteView resourceId={notebook.get('id')} />
				</Box>
				<Dialog.Actions>
					<Dialog.Close />
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
