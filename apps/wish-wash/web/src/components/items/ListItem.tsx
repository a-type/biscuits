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
				className={clsx(`@mode-${typeThemes[type]}`, 'bg-main-wash', className)}
				style={{
					minHeight:
						imageFiles.length ? 300
						: prioritized ? 200
						: undefined,
				}}
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
								className="h-full w-full object-cover object-center"
							/>
						}
					</Card.Image>
				)}
				<Card.Main size="lg" onClick={() => editItem(id)}>
					<Card.Content unstyled>
						<ItemTypeChip item={item} />
					</Card.Content>
					{prompt && <Card.Content>{prompt}</Card.Content>}
					<Card.Title>{description}</Card.Title>
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
				<ItemStar
					item={item}
					style={{ position: 'absolute', right: 4, top: 4, zIndex: 1 }}
				/>
				<Card.Footer
					style={{ alignItems: 'center', justifyContent: 'space-between' }}
				>
					<Card.Actions style={{ marginLeft: 'auto', marginRight: 0 }}>
						{type === 'idea' ||
							(type === 'link' && !link && <SearchButton item={item} />)}
						{link && (
							<Button
								emphasis="default"
								size="small"
								render={<Link to={link} newTab />}
							>
								<Icon name="link" /> View
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
