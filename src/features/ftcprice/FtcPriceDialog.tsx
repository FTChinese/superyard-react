import { ModeBadge } from '../../components/text/Badge';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { Tier } from '../../data/enum';
import { ReqConfig } from '../../http/ReqConfig';
import { PaywallPrice } from '../../data/paywall';
import { useUpsertFtcPrice } from './useUpsertFtcPrice';
import { concatPriceParts, localizedTier } from '../../data/localization';
import { Price, newFtcPriceParts } from '../../data/ftc-price';
import { ConfirmDialog } from '../../components/dialog/ConfirmDialog';
import { capitalize } from '../../utils/strings';
import { FullscreenDialog } from '../../components/dialog/FullscreenDialog';

/**
 * @description A dialog presenting PriceForm.
 * The dialog is in fullscreen mode, diviced into 2 columns,
 * with price form on the left.
 * Once user entered stripe price id, it can be
 * inspected by loading the stripe price data,
 * presented on the right.
 */
export function FtcPriceFormDialog(props: {
  show: boolean;
  onHide: () => void;
  live: boolean;
  form: JSX.Element;
  isCreate: boolean;
  tier: Tier;
}) {

  const title = `${props.isCreate ? 'Create' : 'Update'} Price for a ${props.tier.toUpperCase()} Product`;

  return (
    <FullscreenDialog
      show={props.show}
      onHide={props.onHide}
      title={title}
      headerExtra={<ModeBadge live={props.live} />}
    >
      <FullscreenSingleCol>
        {props.form}
      </FullscreenSingleCol>
    </FullscreenDialog>
  );
}

/**
 * Dialog to confirm price activation.
 */
export function FtcPriceActiveDialog(
  props: {
    show: boolean;
    onHide: () => void;
    config: ReqConfig;
    price: PaywallPrice;
    onSaved: (p: PaywallPrice) => void;
  }
) {
  const {
    activatePrice,
    activating,
  } = useUpsertFtcPrice();

  const title = `${capitalize(strActivate(props.price.active))} price`;

  const body = `Are you sure you want to ${strActivate(props.price.active)} ${priceSumary(props.price)}? ${props.price.active || 'All its siblings will be deactivated.'}`

  return (
    <ConfirmDialog
      title={title}
      body={body}
      show={props.show}
      onHide={props.onHide}
      live={props.config.live}
      onConfirm={() => {
        activatePrice(
          props.price,
          props.config,
          props.onSaved,
        )
      }}
      progress={activating}
    />
  );
}

function priceSumary(price: Price): string {
  return `${localizedTier(price.tier)} ${concatPriceParts(newFtcPriceParts(price))}`;
}

function strActivate(active: boolean): string {
  return active ? 'deactivate' : 'activate'
}

export function FtcPriceArchiveDialog(
  props: {
    show: boolean;
    onHide: () => void;
    config: ReqConfig;
    price: PaywallPrice;
    onSaved: (p: PaywallPrice) => void;
  }
) {
  const {
    archivePrice,
    archiving,
  } = useUpsertFtcPrice();

  return (
    <ConfirmDialog
      show={props.show}
      onHide={props.onHide}
      title='Archie this price?'
      body='Are you sure you want to archive this price?'
      live={props.config.live}
      onConfirm={() => {
        archivePrice(
          props.price.id,
          props.config,
          props.onSaved,
        )
      }}
      progress={archiving}
    />
  )
}
