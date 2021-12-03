import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Discount } from '../../data/price'
import { useState } from 'react';
import { useLiveState } from '../../store/useLiveState';
import Modal from 'react-bootstrap/Modal';
import { ModeBadge, TimezoneBadage } from './Badge';
import { buildDiscountParams, DiscountForm, DiscountFormVal } from './DiscountForm';
import { FormikHelpers } from 'formik';
import { createOffer, dropOffer, refreshPriceOffers } from '../../repository/paywall';
import { CMSPassport } from '../../data/cms-account';
import { isoOffset } from '../../utils/time-formatter';
import { ResponseError } from '../../repository/response-error';
import { PaywallPrice } from '../../data/paywall';
import { toast } from 'react-toastify';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { PriceContent } from './PriceContent';
import { ListLines } from '../../components/list/TextList';
import { OnPriceUpserted } from './callbacks';
import { EffectivePeriod } from './EffectivePeriod';
import { formatPrice } from '../../utils/format-price';

export function DiscountList(
  props: {
    passport: CMSPassport;
    price: PaywallPrice;
    // Callback used at multiple points when:
    // - New discount created;
    // - Discount list refresh;
    // - Discount dropped.
    onUpdatePrice: (price: PaywallPrice) => void;
  }
) {

  const { live } = useLiveState();
  const [ refreshing, setRefreshing ] = useState(false);
  const [ err, setErr ] = useState('');
  const [ show, setShow ] = useState(false);
  const offset = isoOffset(new Date());

  // Create new discount.
  const handleSubmit = (
    values: DiscountFormVal,
    helpers: FormikHelpers<DiscountFormVal>
  ) => {
    helpers.setSubmitting(true);
    setErr('');

    console.log(values);

    const body = buildDiscountParams(
      values,
      {
        createdBy: props.passport.userName,
        priceId: props.price.id,
        offset,
      }
    );

    console.log(body);

    createOffer(
        body,
        { live, token: props.passport.token}
      )
      .then(discount => {
        helpers.setSubmitting(false);
        toast.success('New offer created!')
        setShow(false);
        props.onUpdatePrice({
          ...props.price,
          offers: [
            discount,
            ...props.price.offers
          ]
        });
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        setErr(err.message);
        toast.error(err.message);
      });
  }

  // Refresh active offer list.
  const handleRefresh = () => {
    setRefreshing(true);

    refreshPriceOffers(props.price.id, {
        live,
        token: props.passport.token
      })
      .then(pwp => {
        setRefreshing(false);
        toast.success('Discounts refreshed!')
        props.onUpdatePrice(pwp);
      })
      .catch((err: ResponseError) => {
        setRefreshing(false);
        toast.error(err.message);
      });
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <span>Discount list</span>
          <ButtonGroup
            size="sm"
          >
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              { refreshing ? 'Refreshing...' : 'Refresh' }
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShow(true)}
            >
              New Discount
            </Button>
          </ButtonGroup>
        </Card.Header>
        <table className="table">
          <OfferHead />
          <tbody>
            {
              props.price.offers.map(offer =>
                <OfferRow
                  key={offer.id}
                  passport={props.passport}
                  offer={offer}
                  onDeleted={props.onUpdatePrice}
                />
              )
            }
          </tbody>
        </table>
      </Card>

      <Modal
        show={show}
        fullscreen={true}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title className="me-3">
            Create Discount
          </Modal.Title>
          <ModeBadge live={live} />
        </Modal.Header>
        <Modal.Body>
          <FullscreenTwoCols
            right={<DiscountForm
              errMsg={err}
              onSubmit={handleSubmit}
            />}
          >
            <>
              <h5>Create a discount for price {formatPrice(props.price)}</h5>
              <PriceContent
                price={props.price}
              />

              <h5 className="mt-3">Current Timezone</h5>
              <TimezoneBadage offset={offset}/>

              <h5 className="mt-3">Guide</h5>
              <ListLines
                lines={[
                  "起止时间按你当前所处时区选择即可，不需要做转换。数据提交后会统一转换为0区ISO8601标准时间格式",
                  "永久生效的折扣不需要设置起止时间",
                  "如果一个价格下有多个同类Target，Price off最高者适用"
                ]}
              />
            </>
          </FullscreenTwoCols>
        </Modal.Body>
      </Modal>
    </>
  );
}

/**
 * @description OfferHead shows the head row for discount list.
 */
function OfferHead() {
  const names = ['Description', 'Kind', 'Price Off', 'Status', 'Recurring', 'Effective', ''];

  return (
    <thead>
      <tr>
        {
          names.map((n, i) => <th key={i}>{n}</th>)
        }
      </tr>
    </thead>
  );
}

/**
 * @description OfferRow shows an entry of discount.
 * When deleted, it should notify parent to update ui.
 */
function OfferRow(
  props: {
    passport: CMSPassport;
    offer: Discount;
    onDeleted: OnPriceUpserted;
  }
) {

  const { live } = useLiveState();
  const [ show, setShow ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const handleDrop = () => {
    setLoading(true);

    dropOffer(
      props.offer.id,
      { live, token: props.passport.token}
    )
    .then(pwp => {
      setLoading(false);
      toast.success('Dropped!');
      setShow(false)
      props.onDeleted(pwp);
    })
    .catch((err: ResponseError) => {
      setLoading(false);
      toast.error(err.message);
    });
  };

  return (
    <>
      <tr>
        <td>{props.offer.description}</td>
        <td>{props.offer.kind}</td>
        <td>{props.offer.priceOff}</td>
        <td>{props.offer.status}</td>
        <td>{props.offer.recurring ? 'Yes' : 'No'}</td>
        <td>
          <EffectivePeriod period={props.offer} direction="column" />
        </td>
        <td className="text-end">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShow(true)}
          >
            Drop
          </Button>
        </td>
      </tr>
      <Modal
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          Drop discount
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to drop discount ({props.offer.id}) with price off ¥{props.offer.priceOff}, used for {props.offer.kind} during {props.offer.startUtc} to {props.offer.endUtc}?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            disabled={loading}
            onClick={handleDrop}
          >
            {loading ? 'Processing...' : 'Drop'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

