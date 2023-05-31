import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { ModeBadge } from '../../components/text/Badge';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { CMSPassport } from '../../data/cms-account';
import {
  newStripePriceParts,
  StripeCoupon,
  StripePrice,
} from '../../data/stripe-price';
import { ResponseError } from '../../http/response-error';
import { upsertStripeCoupon } from '../../repository/stripe';
import { buildCouponParams, CouponForm, CouponFormVal } from './CouponForm';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { useCouon } from './useCoupon';
import { SearchBox } from '../../components/forms/SearchBox';
import { toast } from 'react-toastify';
import { CouponCard } from './CouponCard';

export function CouponPullDialog(props: {
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
        helpers.setSubmitting(false);
      })
      .catch((e: ResponseError) => {
        setErr(e.message);
        helpers.setSubmitting(false);
      });
  };

  // ---------
  const {
    searching,
    getCoupon,
    coupon,
  } = useCouon();

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          Pull a coupon from Stripe and edit it
        </Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        <div className='text-center mb-5'>
          <h6>
            Coupon attached to this price
          </h6>
          <PriceHighlight
            parts={
              newStripePriceParts(props.price)
            }
          />
        </div>

        <FullscreenTwoCols
          right={
            coupon && <CouponForm
              onSubmit={handleSubmit}
              coupon={coupon}
            />
          }
        >
          <>
            <SearchBox
              controlId='s'
              onSubmit={(id) => {
                getCoupon(id, {
                  live: props.live,
                  token: props.passport.token
                })
                  .then(result => {
                    if (result.error) {
                      toast.error(result.error);
                    }
                  });
              }}
              label='Search Stripe Coupon'
              progress={searching}
              disabled={searching}
              placeholder='Enter Stripe Coupon ID'
              desc={"Copy coupon id from Stripe dashboard and it will be synced to FTC's database"}
            />

            {
              coupon && <CouponCard
                coupon={coupon}
                menu={null}
              />
            }
          </>
        </FullscreenTwoCols>
      </Modal.Body>
    </Modal>
  );
}
