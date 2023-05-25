import { useState } from 'react';
import { useProgress } from '../../components/hooks/useProgress';
import { PaywallPrice } from '../../data/paywall';
import { ReqConfig } from '../../http/ReqConfig';
import { activateFtcPrice, archiveFtcPrice, loadFtcPrice, refreshFtcPriceOffers } from '../../repository/paywall';
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

  // Activate price.
  const activatePrice = (id: string, config: ReqConfig) => {
    startProgress();

    activateFtcPrice(id, config)
      .then((price) => {
        stopProgress
        toast.success('Price activated');
        setPrice(price);
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
      });
  };

  const archivePrice = (id: string, config: ReqConfig) => {
    startProgress();

    archiveFtcPrice(id, config)
      .then((price) => {
        stopProgress()
        setPrice(price);
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
      });
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
    activatePrice,
    archivePrice,
    onNewOffer,
    refreshOffers,
  };
}
