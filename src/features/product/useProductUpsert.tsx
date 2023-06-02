import { useState } from 'react';
import { ReqConfig } from '../../http/ReqConfig';
import { activateFtcProduct, createFtcProduct, updateFtcProduct } from '../../repository/paywall';
import { toast } from 'react-toastify';
import { ResponseError } from '../../http/response-error';
import { Product } from '../../data/paywall';
import { ProductFormVal, buildNewProductParams, buildUpdateProductParams } from './ProductForm';
import { FormikHelpers } from 'formik';
import { CMSPassport } from '../../data/cms-account';

export function useProductUpsert() {
  // State to activate/deactivate product
  const [activating, setActivating] = useState(false);

  const updateProduct = (
    props: {
      passport: CMSPassport,
      live: boolean,
      onSaved: (p: Product) => void,
      product?: Product,
    }
  ) => {
    const config: ReqConfig = {
      live: props.live,
      token: props.passport.token,
    };

    return (
      values: ProductFormVal,
      helpers: FormikHelpers<ProductFormVal>
    ) => {
      helpers.setSubmitting(true);

    // Update
      if (props.product) {
        const params = buildUpdateProductParams(values);

        updateFtcProduct(props.product.id, params, config)
          .then((prod) => {
            helpers.setSubmitting(false);
            toast.success('Update succeeded');
            props.onSaved(prod);
          })
          .catch((err: ResponseError) => {
            helpers.setSubmitting(false);
            toast.error(err.message);
          });
      } else {
        // Create
        const params = buildNewProductParams(values, props.passport.userName);

        createFtcProduct(params, config)
          .then((prod) => {
            helpers.setSubmitting(false);
            toast.success('Product created');
            props.onSaved(prod);
          })
          .catch((err: ResponseError) => {
            helpers.setSubmitting(false);
            toast.error(err.message);
            if (err.invalid) {
              helpers.setErrors(err.toFormFields);
              return;
            }
          });
        }
    };
  }

  const activateProduct = (
    id: string,
    config: ReqConfig,
    onSaved: (p: Product) => void,
  ) => {
    setActivating(true);

    activateFtcProduct(id, config)
      .then((prod) => {
        setActivating(false);
        toast.success('Activation succeeded. The product is put on paywall.');

        onSaved(prod);
      })
      .catch((err: ResponseError) => {
        setActivating(false);
        toast.error(err.message);
      });
  };

  return {
    activating,
    activateProduct,
    updateProduct,
  };
}
