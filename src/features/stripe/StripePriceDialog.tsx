import { ModeBadge } from '../../components/text/Badge';
import { StripePriceCard } from './StripePriceCard';
import { StripePriceForm } from './StripePriceForm';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { StripePrice, newStripePriceParts } from '../../data/stripe-price';
import { usePriceUpsert } from './usePriceUpsert';
import { ReqConfig } from '../../http/ReqConfig';
import { FullscreenDialog } from '../../components/dialog/FullscreenDialog';
import { Link } from 'react-router-dom';
import { SearchBox } from '../../components/forms/SearchBox';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { CMSPassport } from '../../data/cms-account';
import { sitemap } from '../../data/sitemap';
import { useStripeList } from './useStripeList';
import { ConfirmDialog } from '../../components/dialog/ConfirmDialog';
import { concatPriceParts } from '../../data/localization';

export function StripePriceEdit(
  props: {
    config: ReqConfig,
    price: StripePrice;
    show: boolean;
    onHide: () => void;
    onSaved: (p: StripePrice) => void;
  }
) {

  const {
    updatePrice,
  } = usePriceUpsert();

  return (
    <FullscreenDialog
      show={props.show}
      onHide={props.onHide}
      title='Update Stripe Price Metadata'
      headerExtra={<ModeBadge live={props.config.live} />}
    >
      <FullscreenTwoCols
        right={
          <StripePriceForm
            onSubmit={
              updatePrice(
                props.price,
                props.config,
                props.onSaved
              )
            }
            price={props.price}
          />
        }
      >
        <StripePriceCard
          price={props.price}
        />
      </FullscreenTwoCols>
    </FullscreenDialog>
  );
}

export function StripePricePull(
  props: {
    passport: CMSPassport;
    live: boolean;
    show: boolean;
    onHide: () => void;
  }
) {
  const {
    loadingPrice,
    loadPrice,
    price,
  } = useStripeList();

  return (
    <FullscreenDialog
      show={props.show}
      onHide={props.onHide}
      title='Sync a Stripe Price'
      headerExtra={<ModeBadge live={props.live} />}
    >
      <FullscreenSingleCol>
        <>
          <SearchBox
            controlId='s'
            onSubmit={(priceId) => {
              loadPrice(priceId, {
                live: props.live,
                token: props.passport.token,
              });
            }}
            label="Search Stripe Price"
            progress={loadingPrice}
            disabled={loadingPrice}
            placeholder='Enter Stripe Price ID'
            desc="Copying price id from Stripe dashboard and it will be synced to FTC's database"
          />
          {
            price &&
            <>
              <p>You can now edit this price <Link to={sitemap.stripePriceOf(price.id)}>here</Link></p>

              <StripePriceCard
                price={price}
              />

            </>
          }
        </>
      </FullscreenSingleCol>
    </FullscreenDialog>
  );
}

/**
 * Activate or deactivate a stripe price.
 */
export function StripePriceStatusDialog(
  props: {
    config: ReqConfig,
    price: StripePrice;
    show: boolean;
    onHide: () => void;
    onSaved: (p: StripePrice) => void;
  }
) {

  const {
    changingStatus,
    changeStatus,
  } = usePriceUpsert();

  const title = `${props.price.onPaywall ? 'Deactivate' : 'Activate'} ${concatPriceParts(newStripePriceParts(props.price))}`;

  const body = `Are you sure you want to ${props.price.onPaywall ? 'deactivate' : 'activate'} price ${props.price.id}`

  return (
    <ConfirmDialog
      show={props.show}
      onHide={props.onHide}
      title={title}
      body={body}
      live={props.config.live}
      onConfirm={() => {
        changeStatus(
          props.price,
          props.config,
          props.onSaved
        )
      }}
      progress={changingStatus}
    />
  );
}
