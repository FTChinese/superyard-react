import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Discount, newFtcPriceParts } from '../../data/ftc-price';
import { ModeBadge } from '../../components/text/Badge';
import {
  buildDiscountParams,
  DiscountForm,
  DiscountFormVal,
} from './DiscountForm';
import {
  createOffer,
  dropOffer,
  refreshPriceOffers,
} from '../../repository/paywall';
import { CMSPassport } from '../../data/cms-account';
import { ResponseError } from '../../http/response-error';
import { PaywallPrice } from '../../data/paywall';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { ListLines } from '../../components/list/TextList';
import { OnPaywallPriceUpserted } from './callbacks';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Table, TableHead } from '../../components/list/Table';
import { ISOTimeColumn } from '../../components/text/DateTimeBlock';
import { PriceHighlight } from '../../components/text/PriceHighlight';

export function DiscountList(props: {
  passport: CMSPassport;
  price: PaywallPrice;
  // Callback used at multiple points when:
  // - New discount created;
  // - Discount list refresh;
  // - Discount dropped.
  onPaywallPrice: OnPaywallPriceUpserted;
}) {
  const { live } = useLiveMode();
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);

  // Create new discount.
  const handleSubmit = (
    values: DiscountFormVal,
    helpers: FormikHelpers<DiscountFormVal>
  ) => {
    helpers.setSubmitting(true);
    setErr('');

    console.log(values);

    const body = buildDiscountParams(values, {
      createdBy: props.passport.userName,
      priceId: props.price.id,
    });

    console.log(body);

    createOffer(body, { live, token: props.passport.token })
      .then((discount) => {
        helpers.setSubmitting(false);
        toast.success('New offer created!');
        setShow(false);
        props.onPaywallPrice({
          ...props.price,
          offers: [discount, ...props.price.offers],
        });
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        toast.error(err.message);
        if (err.statusCode === 422) {
          helpers.setErrors(err.toFormFields);
          return;
        }
        setErr(err.message);
      });
  };

  // Refresh active offer list.
  const handleRefresh = () => {
    setRefreshing(true);

    refreshPriceOffers(props.price.id, {
      live,
      token: props.passport.token,
    })
      .then((pwp) => {
        setRefreshing(false);
        toast.success('Discounts refreshed!');
        props.onPaywallPrice(pwp);
      })
      .catch((err: ResponseError) => {
        setRefreshing(false);
        toast.error(err.message);
      });
  };

  const head = (
    <TableHead
      cols={[
        'Description',
        'Kind',
        'Price Off',
        'Status',
        'Recurring',
        'Start',
        'End',
        '',
      ]}
    />
  );

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <span>Discount list</span>
          <ButtonGroup size="sm">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShow(true)}>
              New Discount
            </Button>
          </ButtonGroup>
        </Card.Header>

        <Table head={head}>
          <tbody>
            {props.price.offers.map((offer) => (
              <OfferRow
                key={offer.id}
                passport={props.passport}
                offer={offer}
                onDeleted={props.onPaywallPrice}
              />
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="me-3">Create Discount</Modal.Title>
          <ModeBadge live={live} />
        </Modal.Header>
        <Modal.Body>
          <FullscreenTwoCols
            right={<DiscountForm errMsg={err} onSubmit={handleSubmit} />}
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
        </Modal.Body>
      </Modal>
    </>
  );
}

/**
 * @description OfferRow shows an entry of discount.
 * When deleted, it should notify parent to update ui.
 */
function OfferRow(props: {
  passport: CMSPassport;
  offer: Discount;
  onDeleted: OnPaywallPriceUpserted;
}) {
  const { live } = useLiveMode();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDrop = () => {
    setLoading(true);

    dropOffer(props.offer.id, { live, token: props.passport.token })
      .then((pwp) => {
        setLoading(false);
        toast.success('Dropped!');
        setShow(false);
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
          <ISOTimeColumn date={props.offer.startUtc} />
        </td>
        <td>
          <ISOTimeColumn date={props.offer.endUtc} />
        </td>
        <td className="text-end">
          <Button variant="danger" size="sm" onClick={() => setShow(true)}>
            Drop
          </Button>
        </td>
      </tr>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>Drop discount</Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to drop discount ({props.offer.id}) with price
            off ¥{props.offer.priceOff}, used for {props.offer.kind} during{' '}
            {props.offer.startUtc} to {props.offer.endUtc}?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" disabled={loading} onClick={handleDrop}>
            {loading ? 'Processing...' : 'Drop'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
