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
  imageUrl: string | null;
  link: string | null;
  createdAt: number;
  purchasedAt: number;
}
