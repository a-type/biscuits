export interface HubWishlistData {
  id: string;
  title: string;
  items: HubWishlistItem[];
  hidePurchases: boolean;
}

interface HubWishlistItem {
  description: string;
  count: number;
  prioritized: boolean;
  imageUrls: string[];
  links: string[];
  createdAt: number;
  purchasedCount: number;
}
