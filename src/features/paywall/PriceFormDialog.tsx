import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { CMSPassport } from '../../data/cms-account';
import { PaywallPrice, Product, StripeRawPrice } from '../../data/paywall';
import { Price } from '../../data/price';
import { createPrice, updatePrice } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { liveModeState } from '../../store/recoil-state';
import { ModeBadge } from './Badge';
import { buildNewPriceParams, buildUpdatePriceParams, PriceForm, PriceFormVal } from './PriceForm';
import { StripeRawPriceContent } from './StripeRawPrice';

/**
 * @description A dialog presenting PriceForm.
 * The dialog is in fullscreen mode, diviced into 2 columns,
 * with price form on the left.
 * Once user entered stripe price id, it can be
 * inspected by loading the stripe price data,
 * presented on the right.
 */
export function PriceFormDialog(
  props: {
    passport: CMSPassport;
    show: boolean;
    onHide: () => void;
    onUpserted: (price: PaywallPrice) => void;
    product?: Product; // Exists upon creation.
    price?: Price; // Exists upon updating.
  }
) {

  const tier = props.price?.tier || props.product?.tier;

  if (!tier) {
    return <div>Error: either product or price should be set</div>;
  }

  const live = useRecoilValue(liveModeState);
  const [ err, setErr ] = useState('');
  const [ stripePrice, setStripePrice ] = useState<StripeRawPrice>();

  const handleSubmit = (
    values: PriceFormVal,
    helpers: FormikHelpers<PriceFormVal>
  ) => {
    console.log(values);

    helpers.setSubmitting(true);
    setErr('');

    if (props.price) {
      const body = buildUpdatePriceParams(values);

      updatePrice(
          props.price.id,
          body,
          { live: props.price.liveMode, token: props.passport.token }
        )
        .then(price => {
          helpers.setSubmitting(false);
          toast.success('Update saved!');
          props.onUpserted(price);
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
    } else if(props.product) {

      const body = buildNewPriceParams(
        values,
        {
          productId: props.product.id,
          createdBy: props.passport.userName
        }
      );

      createPrice(
          body,
          { live, token: props.passport.token }
        )
        .then(price => {
          helpers.setSubmitting(false);
          toast.success('Price created!');
          props.onUpserted({
            ...price,
            offers: [],
          });
        })
        .catch((err: ResponseError) => {
          helpers.setSubmitting(false);
          setErr(err.message);
        });
    } else {
      toast.error('Cannot create or update price');
    }
  };

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          {props.price ? 'Update' : 'Create'} Price
        </Modal.Title>
        <ModeBadge live={live} />
      </Modal.Header>
      <Modal.Body>
        <FullscreenTwoCols
          right={
            stripePrice &&
            <StripeRawPriceContent
              price={stripePrice}
            />
          }
        >
          <PriceForm
            onSubmit={handleSubmit}
            onStripePrice={setStripePrice}
            errMsg={err}
            tier={tier}
            price={props.price}
          />
        </FullscreenTwoCols>
      </Modal.Body>
    </Modal>
  );
}
