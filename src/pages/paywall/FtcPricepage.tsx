import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { useProgress } from '../../components/hooks/useProgress';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { isOneTime } from '../../data/enum';
import { toast } from 'react-toastify';
import { FtcPriceScreen } from '../../features/ftcprice/FtcPriceScreen';
import { useFtcPrice } from '../../features/ftcprice/useFtcPrice';
import { NewOfferDialog } from '../../features/ftcprice/NewOfferDialog';
import { DropOfferDialog } from '../../features/ftcprice/DropOfferDialog';
import { Discount } from '../../data/ftc-price';
import { PriceFormDialog } from '../../features/ftcprice/PriceFormDialog';
import { ErrorText } from '../../components/text/ErrorText';

/**
 * FtcPricePage is a page to show a single FTC price.
 */
export function FtcPricePage() {
  const { priceId } = useParams<'priceId'>();
  const { passport } = useAuth();

  const { live } = useLiveMode();

  if (!priceId) {
    return <ErrorText message="Missing price id" />;
  }

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <PricePageScreen
      priceId={priceId}
      passport={passport}
      live={live}
    />
  );
}

function PricePageScreen(
  props: {
    priceId: string;
    passport: CMSPassport;
    live: boolean;
  }
) {

  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);

  const [alertDropOffer, setAlertDropOffer] = useState<Discount>();

  const { progress } = useProgress();

  const {
    price,
    loadPrice,
    activatePrice,
    archivePrice,
    onPriceUpdated,
    onNewOffer,
    refreshOffers,
  } = useFtcPrice();

  // Load ftc price upon mount.
  useEffect(() => {
    loadPrice(props.priceId, {
      live: props.live,
      token: props.passport.token,
    });
  }, [props.live]);

  if (!price) {
    return <div>Loading FTC price...</div>;
  }

  return (
    <>
      <FtcPriceScreen
        price={price}
        progress={progress}
        onEdit={() => {
          setShowPriceForm(true);
        }}
        onActivate={() => {
          activatePrice(price.id, {
            live: props.live,
            token: props.passport.token,
          });
        }}
        onArchive={() => {
          archivePrice(price.id, {
            live: props.live,
            token: props.passport.token,
          })
        }}
        onNewOffer={() => {
          if (isOneTime(price.kind)) {
            toast.error('Introductory price cannot have coupons');
            return;
          }
          setShowOfferForm(true);
        }}
        onRefreshOffers={() => {
          refreshOffers(price.id, {
            live: props.live,
            token: props.passport.token,
          })
        }}
        onDeleteOffer={(o) => {
          setAlertDropOffer(o);
        }}
      />

      <PriceFormDialog
        passport={props.passport}
        show={showPriceForm}
        onHide={() => setShowPriceForm(false)}
        onUpserted={onPriceUpdated}
        price={price}
      />
      <NewOfferDialog
        passport={props.passport}
        live={props.live}
        price={price}
        show={showOfferForm}
        onHide={() => {
          setShowOfferForm(false);
        }}
        onCreated={onNewOffer}
      />

      {
        alertDropOffer &&
        <DropOfferDialog
          passport={props.passport}
          live={props.live}
          offer={alertDropOffer}
          show={!!alertDropOffer}
          onHide={() => setAlertDropOffer(undefined)}
          onDropped={onPriceUpdated}
        />
      }

    </>
  );
}
