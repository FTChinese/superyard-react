import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { CMSPassport } from '../../data/cms-account';
import { PaywallPrice, Product } from '../../data/paywall';
import { Price } from '../../data/price';
import { createPrice, updatePrice } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { useLiveState } from '../../store/useLiveState';
import { ModeBadge } from './Badge';
import { buildNewPriceParams, buildUpdatePriceParams, PriceForm, PriceFormVal } from './PriceForm';

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

  const { live } = useLiveState();
  const [ err, setErr ] = useState('');

  const handleSubmit = (
    values: PriceFormVal,
    helpers: FormikHelpers<PriceFormVal>
  ) => {
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
          props.onUpserted(price);
        })
        .catch((err: ResponseError) => {
          helpers.setSubmitting(false);
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
        <div className="container-fluid">
          <div className="row row-cols-1 row-cols-md-2">
            <div className="col">
              <PriceForm
                onSubmit={handleSubmit}
                errMsg={err}
                tier={tier}
                price={props.price}
              />
            </div>
            <div className="col">

            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
