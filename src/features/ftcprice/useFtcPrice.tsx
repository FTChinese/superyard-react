import { useState } from 'react';
import { useProgress } from '../../components/hooks/useProgress';
import { PaywallPrice } from '../../data/paywall';
import { ReqConfig } from '../../http/ReqConfig';
import { loadFtcPrice, refreshFtcPriceOffers } from '../../repository/paywall';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { Discount } from '../../data/ftc-price';

export function useFtcPrice() {
  const { startProgress, stopProgress } = useProgress();

  const [price, setPrice] = useState<PaywallPrice>();

  // Load an ftc price.
  const loadPrice = (id: string, config: ReqConfig) => {
    startProgress();
    setPrice(undefined);

    loadFtcPrice(id, config)
      .then((p) => {
        setPrice(p);
        stopProgress();
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
      });
  };

  const onPriceUpdated = (p: PaywallPrice) => {
    setPrice(p)
  }

  const onNewOffer = (offer: Discount) => {
    if (price) {
      setPrice({
        ...price,
        offers: [offer, ...price.offers]
      });
    }
  }

  const refreshOffers = (priceId: string, config: ReqConfig) => {
    startProgress();

    refreshFtcPriceOffers(priceId, config)
      .then((pwp) => {
        stopProgress();
        toast.success('Discounts refreshed!');
        setPrice(pwp)
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
      });
  }

  return {
    price,
    loadPrice,
    onPriceUpdated,
    onNewOffer,
    refreshOffers,
  };
}
