import { PaywallPrice, Product } from '../../data/paywall';
import { Price } from '../../data/ftc-price';

export type OnProductUpserted = (product: Product) => void;
export type OnPriceUpserted = (price: Price) => void;
export type OnPaywallPriceUpserted = (price: PaywallPrice) => void;

