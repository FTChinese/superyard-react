import { FormikHelpers } from 'formik';
import { BannerFormVal, buildBannerParams, buildPromoParams } from './BannerForm';
import { ReqConfig } from '../../http/ReqConfig';
import { dropPaywallPromo, savePaywallBanner, savePaywallPromo } from '../../repository/paywall';
import { toast } from 'react-toastify';
import { ResponseError } from '../../http/response-error';
import { PaywallDoc } from '../../data/paywall';
import { useState } from 'react';

export function useBanner() {

  const [paywallDoc, setPaywallDoc] = useState<PaywallDoc>();
  const [dropping, setDropping] = useState(false);

  const saveBanner = (
    config: ReqConfig,
    onSaved: (pwd: PaywallDoc) => void,
  ) => {
    return (
      values: BannerFormVal,
      helpers: FormikHelpers<BannerFormVal>
    ) => {
      helpers.setSubmitting(true);
      console.log(values);

      const params = buildBannerParams(values);

      savePaywallBanner(params, config)
        .then((pwd) => {
          onSaved(pwd);
          setPaywallDoc(pwd);
          helpers.setSubmitting(false);
          toast.info('Saved! Click Rebuild button to bust cach.');
        })
        .catch((err: ResponseError) => {
          helpers.setSubmitting(false);
          toast.error(err.message);
          if (err.invalid) {
            helpers.setErrors(err.toFormFields);
            return;
          }
        });
    };
  };

  const createPromo = (
    config: ReqConfig,
    onSaved: (pwd: PaywallDoc) => void,
  ) => {
    return (
      values: BannerFormVal,
      helpers: FormikHelpers<BannerFormVal>
    ) => {
      helpers.setSubmitting(true);
      console.log(values);

      const params = buildPromoParams(values);

      savePaywallPromo(params, config)
        .then((pwd) => {
          helpers.setSubmitting(false);
          setPaywallDoc(pwd);
          onSaved(pwd)
          toast.info('Saved! Click Rebuild button to bust cach.');
        })
        .catch((err: ResponseError) => {
          helpers.setSubmitting(false);
          toast.error(err.message);
          if (err.invalid) {
            helpers.setErrors(err.toFormFields);
            return;
          }
        });
    };
  };

  const dropPromo = (
    config: ReqConfig,
    onSaved: (pwd: PaywallDoc) => void,
  ) => {
    setDropping(true);

    dropPaywallPromo(config)
      .then((pwd) => {
        console.log(pwd);
        setPaywallDoc(pwd)
        setDropping(false);
        toast.success('Dropped. Please rebuild paywall.');
        onSaved(pwd)
      })
      .catch((err: ResponseError) => {
        setDropping(false);
        toast.error(err.message);
      });
  }

  return {
    saveBanner,
    createPromo,
    dropPromo,
    dropping,
    paywallDoc,
  }
}
