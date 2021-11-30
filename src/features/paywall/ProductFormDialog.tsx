import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { createProduct, updateProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { useLiveState } from '../../store/useLiveState';
import { ModeBadge } from './Badge';
import { ProductFormVal, ProductForm, buildNewProductParams, buildUpdateProductParams } from './ProductForm';

export function ProductFormDialog(
  props: {
    passport: CMSPassport;
    show: boolean;
    onHide: () => void;
    onUpserted: (product: Product) => void;
    product?: Product;
  }
) {

  const { live } = useLiveState();
  const [ err, setErr ] = useState('');

  const handleSubmit = (
    values: ProductFormVal,
    helpers: FormikHelpers<ProductFormVal>
  ) => {
    helpers.setSubmitting(true);
    setErr('');

    // Update
    if (props.product) {
      const params = buildUpdateProductParams(values);

      updateProduct(
          props.product.id,
          params,
          { live: props.product.liveMode, token: props.passport.token}
        )
        .then(prod => {
          helpers.setSubmitting(false);
          props.onUpserted(prod);
        })
        .catch((err: ResponseError) => {
          helpers.setSubmitting(false);
          setErr(err.message);
        });
    } else {
      // Create
      const params = buildNewProductParams(values, props.passport.userName);

      createProduct(
          params,
          { live, token: props.passport.token }
        )
        .then(prod => {
          helpers.setSubmitting(false);
          console.log(prod);
          props.onUpserted(prod);
        })
        .catch((err: ResponseError) => {
          helpers.setSubmitting(false);
          setErr(err.message);
        });
    }
  }

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          {props.product ? 'Update' : 'Create'} Product
        </Modal.Title>
        <ModeBadge live={live} />
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
