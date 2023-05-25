import Modal from 'react-bootstrap/esm/Modal';
import { ModeBadge } from '../../components/text/Badge';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { ListLines } from '../../components/list/TextList';
import { CMSPassport } from '../../data/cms-account';
import { PaywallPrice } from '../../data/paywall';
import { Discount, newFtcPriceParts } from '../../data/ftc-price';
import { useState } from 'react';
import { DiscountForm, DiscountFormVal, buildDiscountParams } from './DiscountForm';
import { FormikHelpers } from 'formik';
import { createFtcOffer } from '../../repository/paywall';
import { toast } from 'react-toastify';
import { ResponseError } from '../../http/response-error';

export function NewOfferDialog(
  props: {
    passport: CMSPassport;
    live: boolean;
    price: PaywallPrice;
    show: boolean;
    onHide: () => void;
    onCreated: (o: Discount) => void;
  }
) {

  const [err, setErr] = useState('');

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

    createFtcOffer(
      body,
      {
        live: props.live,
        token: props.passport.token
      }
    )
      .then((discount) => {
        helpers.setSubmitting(false);
        toast.info('Success');
        props.onCreated(discount);
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

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">Create Discount</Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>
      <Modal.Body>
        <FullscreenTwoCols
          right={
            <DiscountForm
              errMsg={err}
              onSubmit={handleSubmit}
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
      </Modal.Body>
    </Modal>
  );
}
