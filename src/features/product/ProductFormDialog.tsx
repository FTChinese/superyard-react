import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { createFtcProduct, updateFtcProduct } from '../../repository/paywall';
import { ResponseError } from '../../http/response-error';
import { ModeBadge } from '../../components/text/Badge';
import { OnProductUpserted } from './callbacks';
import {
  ProductFormVal,
  ProductForm,
  buildNewProductParams,
  buildUpdateProductParams,
} from './ProductForm';

/**
 * @description ProductFormDialog is used to prsent ProductForm when
 * creating a new product, or updating an existing one.
 */
export function ProductFormDialog(props: {
  passport: CMSPassport;
  live: boolean;
  show: boolean;
  onHide: () => void;
  onUpserted: OnProductUpserted;
  product?: Product;
}) {

  const [err, setErr] = useState('');

  const handleSubmit = (
    values: ProductFormVal,
    helpers: FormikHelpers<ProductFormVal>
  ) => {
    helpers.setSubmitting(true);
    setErr('');

    // Update
    if (props.product) {
      const params = buildUpdateProductParams(values);

      updateFtcProduct(props.product.id, params, {
        live: props.product.liveMode,
        token: props.passport.token,
      })
        .then((prod) => {
          helpers.setSubmitting(false);
          toast.success('Update succeeded');
          props.onUpserted(prod);
        })
        .catch((err: ResponseError) => {
          helpers.setSubmitting(false);
          setErr(err.message);
        });
    } else {
      // Create
      const params = buildNewProductParams(values, props.passport.userName);

      createFtcProduct(params, {
        live: props.live,
        token: props.passport.token
      })
        .then((prod) => {
          helpers.setSubmitting(false);
          console.log(prod);
          toast.success('Product created');
          props.onUpserted(prod);
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
    }
  };

  return (
    <Modal show={props.show} fullscreen={true} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          {props.product ? 'Update' : 'Create'} Product
        </Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <ProductForm
                onSubmit={handleSubmit}
                errMsg={err}
                product={props.product}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
