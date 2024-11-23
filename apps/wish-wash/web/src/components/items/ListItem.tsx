import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { Button } from '@a-type/ui/components/button';
import { Card } from '@a-type/ui/components/card';
import { Icon } from '@a-type/ui/components/icon';
import { Link } from '@verdant-web/react-router';
import { Item } from '@wish-wash.biscuits/verdant';
import { ItemStar } from './ItemStar.jsx';
import { SearchButton } from './SearchButton.jsx';
import { useEditItem } from './hooks.js';
import { ItemTypeChip } from './ItemTypeChip.jsx';
import { Chip } from '@a-type/ui/components/chip';
import { ImageMarquee } from './ImageMarquee.jsx';
import { CSSProperties, forwardRef } from 'react';
import { typeThemes } from '@wish-wash.biscuits/common';

export interface ListItemProps {
	item: Item;
	style?: CSSProperties;
	className?: string;
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
	function ListItem({ item, className, ...rest }, ref) {
		const {
			purchasedCount,
			count,
			description,
			links,
			id,
			imageFiles,
			type,
			lastPurchasedAt,
			prioritized,
			priceMin,
			priceMax,
			remoteImageUrl,
		} = hooks.useWatch(item);
		hooks.useWatch(links);
		hooks.useWatch(imageFiles);
		const link = links.get(0);

		const editItem = useEditItem();

		const purchased = purchasedCount > count;

		const price =
			priceMin || priceMax ?
				!priceMin || !priceMax ?
					priceMax || priceMin
				:	`${priceMin} - ${priceMax}`
			:	null;

		const hasImage = imageFiles.length > 0 || remoteImageUrl;

		return (
			<Card
				ref={ref}
				className={clsx(
					prioritized ? 'min-h-300px sm:min-h-40dvw'
					: imageFiles.length ? 'min-h-300px'
					: '',
					`theme-${typeThemes[type]}`,
					'bg-primary-wash',
					className,
				)}
				data-span={prioritized ? 2 : 1}
				{...rest}
			>
				{hasImage && (
					<Card.Image>
						{imageFiles.length > 0 ?
							<ImageMarquee images={imageFiles.getAll()} />
						:	<img
								src={remoteImageUrl!}
								alt={description}
								className="w-full h-full object-cover object-center"
							/>
						}
					</Card.Image>
				)}
				<Card.Main className="col items-start" onClick={() => editItem(id)}>
					<Card.Content unstyled className="pt-2 pl-1">
						<ItemTypeChip item={item} />
					</Card.Content>
					<Card.Content
						unstyled
						className={clsx(
							'p-1 font-bold',
							hasImage ?
								'bg-[rgba(0,0,0,0.5)] text-[white] text-xl'
							:	'text-lg color-primary-dark',
						)}
					>
						<span>{description}</span>
					</Card.Content>
					{price && <Card.Content className="text-md">{price}</Card.Content>}
					<Card.Content unstyled>
						{lastPurchasedAt && (
							<Chip className="text-xxs">
								Bought: {new Date(lastPurchasedAt).toLocaleDateString()}
							</Chip>
						)}
					</Card.Content>
				</Card.Main>
				<ItemStar item={item} className="absolute right-1 top-1 z-1" />
				<Card.Footer className="items-center justify-between">
					<Card.Actions className="ml-auto mr-0">
						{type === 'idea' ||
							(type === 'link' && !link && <SearchButton item={item} />)}
						{link && (
							<Button asChild color="default" size="small">
								<Link to={link} newTab>
									<Icon name="link" /> View
								</Link>
							</Button>
						)}
						<Button
							toggled={!!purchased}
							color={purchased ? 'default' : 'primary'}
							toggleMode="indicator"
							onClick={() => {
								// TODO: Implement
							}}
							size="small"
						>
							{purchased ? 'Bought' : 'Buy'}
						</Button>
					</Card.Actions>
				</Card.Footer>
			</Card>
		);
	},
);
