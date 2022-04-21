import { CMSPassport } from '../../data/cms-account';
import { collectProductItems, Paywall } from '../../data/paywall';
import { ProductCard } from './ProductCard';
import { BannerCard, PromoCard } from './BannerCard';

export function PaywallContent(
  props: {
    passport: CMSPassport;
    paywall: Paywall;
  }
) {

  const productList = collectProductItems(props.paywall);

  return (
    <div>
      <BannerCard
        banner={props.paywall.banner}
        passport={props.passport}
      />
      <PromoCard
        promo={props.paywall.promo}
        passport={props.passport}
      />

      <div className="row row-cols-1 row-cols-md-2">
        {
          productList.map(item => (
            <div
              className="col"
              key={item.product.id}
            >
              <ProductCard
                product={item.product}
                ftc={item.ftcPrices}
                stripe={item.stripePrices}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}


