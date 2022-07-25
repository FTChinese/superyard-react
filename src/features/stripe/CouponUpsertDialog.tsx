import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { ModeBadge } from '../../components/text/Badge';
import { ErrorAlert } from '../../components/text/ErrorAlert';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { CMSPassport } from '../../data/cms-account';
import {
  formatCouponAmount,
  StripeCoupon,
  StripePrice,
  stripePriceFormat,
} from '../../data/stripe-price';
import { ResponseError } from '../../http/response-error';
import { upsertStripeCoupon } from '../../repository/stripe';
import { buildCouponParams, CouponForm, CouponFormVal } from './CouponForm';

export function CouponUpsertDialog(props: {
  passport: CMSPassport;
  live: boolean;
  price: StripePrice;
  coupon?: StripeCoupon; // Present upon editing.
  show: boolean;
  onHide: () => void;
  onCreated: (c: StripeCoupon) => void;
}) {
  const [err, setErr] = useState('');

  const handleSubmit = (
    values: CouponFormVal,
    helpers: FormikHelpers<CouponFormVal>
  ) => {
    helpers.setSubmitting(true);

    upsertStripeCoupon(
        values.couponId,
        buildCouponParams(props.price.id, values),
        {
          live: props.live,
          token: props.passport.token,
        }
      )
      .then((c) => {
        props.onCreated(c);
      })
      .catch((e: ResponseError) => {
        setErr(e.message);
      });
  };

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          {
            props.coupon ? 'Update Coupon' : 'Create Coupon'
          }
        </Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>
            <div className="text-center">
              <h6>
                {
                  props.coupon ?
                    'Modify an existing coupon under price' :
                    'Attach a coupon to this price'
                }
              </h6>
              <PriceHighlight
                parts={
                  stripePriceFormat(props.price).formatToParts()
                }
              />
              {
                props.coupon &&
                <div>{formatCouponAmount(props.coupon)}</div>
              }
            </div>

            <ErrorAlert
              msg={err}
              onClose={() => setErr('')}
            />
            <CouponForm
              onSubmit={handleSubmit}
              coupon={props.coupon}
            />
          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}
