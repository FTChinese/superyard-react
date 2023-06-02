import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { isOneTime } from '../../data/enum';
import { OfferListSection, OfferItem } from '../../features/ftcprice/OfferList';
import { useFtcPrice } from '../../features/ftcprice/useFtcPrice';
import { NewOfferDialog } from '../../features/ftcprice/OfferDialog';
import { DropOfferDialog } from '../../features/ftcprice/OfferDialog';
import { Discount } from '../../data/ftc-price';
import { FtcPriceActiveDialog, FtcPriceArchiveDialog, FtcPriceFormDialog } from '../../features/ftcprice/FtcPriceDialog';
import { ErrorText } from '../../components/text/ErrorText';
import { PriceForm } from '../../features/ftcprice/FtcPriceForm';
import { useUpsertFtcPrice } from '../../features/ftcprice/useUpsertFtcPrice';
import { ReqConfig } from '../../http/ReqConfig';
import { FtcPriceMenu, FtcPriceSection } from '../../features/ftcprice/FtcPriceCard';

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

  const config: ReqConfig = {
    live: props.live,
    token: props.passport.token,
  };

  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showPriceActivate, setShowPriceActivate] = useState(false);
  const [showPriceArchive, setShowPriceArchive] = useState(false);

  const [showOfferForm, setShowOfferForm] = useState(false);

  const [deleteTargetOffer, setDeleteTargetOffer] = useState<Discount>();

  const {
    price,
    loadPrice,
    onPriceUpdated,
    onNewOffer,
    refreshOffers,
  } = useFtcPrice();

  const {
    updatePrice,
  } = useUpsertFtcPrice();

  // Load ftc price upon mount.
  useEffect(() => {
    loadPrice(props.priceId, config);
  }, [props.live]);

  if (!price) {
    return <div>Loading FTC price...</div>;
  }

  return (
    <>
      <FtcPriceSection
        price={price}
        menu={
          <FtcPriceMenu
            active={price.active}
            archived={price.archived}
            progress={false}
            onEdit={() => {
              setShowPriceForm(true);
            }}
            onActivate={() => {
              setShowPriceActivate(true);
            }}
            onArchive={() => {
              setShowPriceArchive(true);
            }}
          />
        }
      />

      <FtcPriceFormDialog
        show={showPriceForm}
        onHide={() => setShowPriceForm(false)}
        live={props.live}
        form={
          <PriceForm
            onSubmit={
              updatePrice(
                price,
                config,
                onPriceUpdated,
              )
            }
            price={price}
          />
        }
        isCreate={false}
        tier={price.tier}
      />

      <FtcPriceActiveDialog
        show={showPriceActivate}
        onHide={() => setShowPriceActivate(false)}
        config={config}
        price={price}
        onSaved={onPriceUpdated}
      />

      <FtcPriceArchiveDialog
        show={showPriceArchive}
        onHide={() => setShowPriceArchive(false)}
        config={config}
        price={price}
        onSaved={onPriceUpdated}
      />

      {
        isOneTime(price.kind) ?
          <div className='text-danger'>
          Introductory price has no discount.
          </div> :
          <OfferListSection
            progress={false}
            onNewOffer={() => {
              setShowOfferForm(true);
            }}
            onRefresh={() => {
              refreshOffers(price.id, {
                live: props.live,
                token: props.passport.token,
              })
            }}
            items={
              price.offers.map((offer) => (
                <OfferItem
                  offer={offer}
                  onDelete={setDeleteTargetOffer}
                />
              ))
            }
          />
      }

      <NewOfferDialog
        passport={props.passport}
        live={props.live}
        price={price}
        show={showOfferForm}
        onHide={() => {
          setShowOfferForm(false);
        }}
        onSaved={onNewOffer}
      />

      {
        deleteTargetOffer &&
        <DropOfferDialog
          config={config}
          offer={deleteTargetOffer}
          show={!!deleteTargetOffer}
          onHide={() => setDeleteTargetOffer(undefined)}
          onDropped={onPriceUpdated}
        />
      }
    </>
  );
}
