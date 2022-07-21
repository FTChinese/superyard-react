import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { ModeBadge } from '../../components/text/Badge';
import { ErrorAlert } from '../../components/text/ErrorAlert';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { CMSPassport } from '../../data/cms-account';
import {
  StripeCoupon,
  StripePrice,
  stripePriceFormat,
} from '../../data/stripe-price';
import { updateCoupon } from '../../repository/paywall';
import { ResponseError } from '../../http/response-error';
import { buildCouponParams, CouponForm, CouponFormVal } from './CouponForm';

export function CouponFormDialog(props: {
  passport: CMSPassport;
  live: boolean;
  price: StripePrice;
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

    updateCoupon(values.couponId, buildCouponParams(props.price.id, values), {
      live: props.live,
      token: props.passport.token,
    })
      .then((c) => {
        props.onCreated(c);
      })
      .catch((e: ResponseError) => {
        setErr(e.message);
      });
  };

  return (
    <Modal show={props.show} fullscreen={true} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="me-3">Create Coupon</Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>
            <div className="text-center">
              <h6>Attach a coupon to this price</h6>
              <PriceHighlight
                parts={stripePriceFormat(props.price).formatToParts()}
              />
            </div>

            <ErrorAlert msg={err} onClose={() => setErr('')} />
            <CouponForm onSubmit={handleSubmit} />
          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}
