import { hooks } from '@/hooks.js';
import { Button, Card, Chip, clsx, Icon } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { typeThemes } from '@wish-wash.biscuits/common';
import { Item } from '@wish-wash.biscuits/verdant';
import { CSSProperties, forwardRef } from 'react';
import { useEditItem } from './hooks.js';
import { ImageMarquee } from './ImageMarquee.jsx';
import { ItemOldBadge } from './ItemOldBadge.jsx';
import { ItemStar } from './ItemStar.jsx';
import { ItemTypeChip } from './ItemTypeChip.jsx';
import { SearchButton } from './SearchButton.jsx';

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
			prompt,
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
					prioritized ? 'min-h-200px sm:min-h-250px'
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
					{prompt && <Card.Content unstyled={!hasImage}>{prompt}</Card.Content>}
					<Card.Content
						unstyled
						className={clsx(
							'p-1 font-bold',
							hasImage ?
								'bg-[rgba(0,0,0,0.5)] px-md text-[white] text-xl'
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
						<ItemOldBadge item={item} />
					</Card.Content>
				</Card.Main>
				<ItemStar item={item} className="absolute right-1 top-1 z-1" />
				<Card.Footer className="items-center justify-between">
					<Card.Actions className="ml-auto mr-0">
						{type === 'idea' ||
							(type === 'link' && !link && <SearchButton item={item} />)}
						{link && (
							<Button asChild emphasis="default" size="small">
								<Link to={link} newTab>
									<Icon name="link" /> View
								</Link>
							</Button>
						)}
						{type === 'link' && (
							<Button
								toggled={!!purchased}
								emphasis={purchased ? 'default' : 'primary'}
								toggleMode="indicator"
								onClick={() => {
									item.set('purchasedCount', purchasedCount + 1);
									item.set('lastPurchasedAt', Date.now());
								}}
								size="small"
							>
								{purchased ? 'Bought' : 'Buy'}
							</Button>
						)}
					</Card.Actions>
				</Card.Footer>
			</Card>
		);
	},
);
