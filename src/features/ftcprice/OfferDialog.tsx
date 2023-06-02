import { ModeBadge } from '../../components/text/Badge';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { ListLines } from '../../components/list/TextList';
import { CMSPassport } from '../../data/cms-account';
import { PaywallPrice } from '../../data/paywall';
import { Discount, newFtcPriceParts } from '../../data/ftc-price';
import { DiscountForm } from './OfferForm';
import { FullscreenDialog } from '../../components/dialog/FullscreenDialog';
import { useOffer } from './useOffer';
import { ConfirmDialog } from '../../components/dialog/ConfirmDialog';
import { ReqConfig } from '../../http/ReqConfig';

export function NewOfferDialog(
  props: {
    passport: CMSPassport;
    live: boolean;
    price: PaywallPrice;
    show: boolean;
    onHide: () => void;
    onSaved: (o: Discount) => void;
  }
) {

  const {
    createOffer,
  } = useOffer();

  return (
    <FullscreenDialog
      show={props.show}
      onHide={props.onHide}
      title='Create Discount'
      headerExtra={<ModeBadge live={props.live} />}
    >
      <FullscreenTwoCols
        right={
          <DiscountForm
            onSubmit={createOffer({
              passport: props.passport,
              live: props.live,
              price: props.price,
              onSaved: props.onSaved
            })}
          />
        }
      >
        <>
          <h5>
            <span className="me-2">Discount for price</span>
            <PriceHighlight
              parts={newFtcPriceParts(props.price)}
            />
          </h5>

          <h5 className="mt-3">Guide</h5>
          <ListLines
            lines={[
              '永久生效的折扣不需要设置起止时间',
              '如果一个价格下有多个同类Target，Amount off最高者适用',
            ]}
          />
        </>
      </FullscreenTwoCols>
    </FullscreenDialog>
  );
}

export function DropOfferDialog(
  props: {
    config: ReqConfig;
    offer: Discount;
    show: boolean;
    onHide: () => void;
    onDropped: (price: PaywallPrice) => void;
  }
) {
  const {
    dropOffer,
    dropping,
  } = useOffer();

  const body = `Are you sure you want to drop discount (${props.offer.id}) with price off ¥${props.offer.priceOff}, used for ${props.offer.kind} during ${props.offer.startUtc} to ${props.offer.endUtc}?`;

  return (
    <ConfirmDialog
      title='Drop discount'
      body={body}
      show={props.show}
      onHide={props.onHide}
      live={props.config.live}
      onConfirm={() => {
        dropOffer(
          props.offer.id,
          props.config,
          props.onDropped,
        )
      }}
      progress={dropping}
    />
  );
}
