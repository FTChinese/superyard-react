import { FormikHelpers } from 'formik';
import { PriceFormVal, buildNewPriceParams, buildUpdatePriceParams } from './FtcPriceForm';
import { activateFtcPrice, archiveFtcPrice, createFtcPrice, updateFtcPrice } from '../../repository/paywall';
import { PaywallPrice, Product } from '../../data/paywall';
import { ReqConfig } from '../../http/ReqConfig';
import { toast } from 'react-toastify';
import { ResponseError } from '../../http/response-error';
import { useState } from 'react';
import { Price } from '../../data/ftc-price';

/**
 * Create, update ftc price.
 */
export function useUpsertFtcPrice() {

  const [activating, setActivating] = useState(false);
  const [archiving, setArchiving] = useState(false);

  /**
   * Handle form submit to create a new price.
   */
  const createPrice = (
    product: Product,
    config: ReqConfig,
    onSaved: (price: PaywallPrice) => void,
  ) => {
    return (
      values: PriceFormVal,
      helpers: FormikHelpers<PriceFormVal>
    ) => {
      console.log(values);

      helpers.setSubmitting(true);

      const body = buildNewPriceParams(
        values,
        {
          productId: product.id,
          tier: product.tier,
        }
      );

      createFtcPrice(body, config)
        .then((p) => {
          helpers.setSubmitting(false);
          toast.success('Price created!');
          onSaved(p);
        })
        .catch((err: ResponseError) => {
          console.log(err.message);
          toast.error(err.message);
          helpers.setSubmitting(false);

          if (err.invalid) {
            helpers.setErrors(err.toFormFields);
          }
        });
    };
  };

  /**
   * Handle form submit to update a price.
   */
  const updatePrice = (
    price: PaywallPrice,
    config: ReqConfig,
    onSaved: (p: PaywallPrice) => void,
  ) => {
    return (
      values: PriceFormVal,
      helpers: FormikHelpers<PriceFormVal>
    ) => {

      const body = buildUpdatePriceParams(values);

      helpers.setSubmitting(true);

      updateFtcPrice(price.id, body, config)
        .then((price) => {
          helpers.setSubmitting(false);
          toast.success('Update saved!');
          onSaved(price);
        })
        .catch((err: ResponseError) => {
          if (err.invalid) {
            helpers.setErrors(err.toFormFields);
          } else {
            toast.error(err.message);
          }
          helpers.setSubmitting(false);
        });
    };
  };

  /**
   * Handle button to activate/deactivate a price.
   */
  const activatePrice = (
    price: Price,
    config: ReqConfig,
    onSaved: (p: PaywallPrice) => void,
  ) => {
    setActivating(true);

    activateFtcPrice(price, config)
      .then((newPrice) => {
        setActivating(false);
        toast.success('Price activated');
        onSaved(newPrice);
      })
      .catch((err: ResponseError) => {
        setActivating(false);
        toast.error(err.message);
      });
  };

  /**
   * Handle button to archive a price.
   */
  const archivePrice = (
    id: string,
    config: ReqConfig,
    onSaved: (p: PaywallPrice) => void,
  ) => {
    setArchiving(true);

    archiveFtcPrice(id, config)
      .then((price) => {
        setArchiving(false);
        toast.success('Price archived!');
        onSaved(price);
      })
      .catch((err: ResponseError) => {
        setArchiving(false);
        toast.error(err.message);
      });
  };

  return {
    createPrice,
    updatePrice,
    activatePrice,
    activating,
    archivePrice,
    archiving,
  };
}
