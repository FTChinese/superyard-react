import { PaywallPrice, Product } from '../../data/paywall';

export type OnPriceUpserted = (price: PaywallPrice) => void;
export type OnProductUpserted = (product: Product) => void;
