import { Form, Formik, FormikHelpers } from 'formik';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import { Cycle, cycleOpts, Tier, tierOpts } from '../../data/enum';
import { NewPriceParams, UpdatePriceParams, Price } from '../../data/price';
import { invalidMessages } from '../../data/form-value';
import { Dropdown } from '../../components/controls/Dropdown';
import { TextInput } from '../../components/controls/TextInput';
import ProgressButton from '../../components/buttons/ProgressButton';

export type PriceFormVal = {
  tier: Tier;
  cycle: Cycle;
  unitAmount: number;
  stripePriceId: string;
  description?: string;
  nickname?: string;
};

export function buildNewPriceParams(
  v: PriceFormVal,
  meta: {
    productId: string,
    createdBy: string,
  }
): NewPriceParams {
  return {
    ...meta,
    unitAmount: v.unitAmount,
    tier: v.tier,
    cycle: v.cycle,
    stripePriceId: v.stripePriceId,
    nickname: v.nickname || undefined,
    description: v.description || undefined,
  };
}

export function buildUpdatePriceParams(v: PriceFormVal): UpdatePriceParams {
  return {
    stripePriceId: v.stripePriceId,
    nickname: v.nickname || undefined,
    description: v.description || undefined,
  }
}

export function PriceForm(
  props: {
    onSubmit: (
      values: PriceFormVal,
      formikHelpers: FormikHelpers<PriceFormVal>
    ) => void | Promise<any>;
    errMsg: string;
    tier: Tier;
    price?: Price;
  }
) {
  const [errMsg, setErrMsg] = useState('');

  const isUpdate = !!props.price;

  useEffect(() => {
    setErrMsg(props.errMsg);
  }, [props.errMsg]);

  return (
    <>
      {
        errMsg &&
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErrMsg('')}>
          {errMsg}
        </Alert>
      }
      <Formik<PriceFormVal>
        initialValues={{
          tier: props.tier,
          cycle: props.price?.cycle || ('' as Cycle),
          unitAmount: props.price?.unitAmount || 0,
          stripePriceId: props.price?.stripePriceId || '',
          description: props.price?.description || '',
          nickname: props.price?.nickname || ''
        }}
        validationSchema={Yup.object({
          tier: Yup.string()
            .required(invalidMessages.required),
          cycle: Yup.string()
            .required(invalidMessages.required),
          unitAmount: Yup.number()
            .min(0, 'Price cannot be less than 0')
            .required(),
          stripePriceId: Yup.string()
            .required(invalidMessages.required)
        })}
        onSubmit={props.onSubmit}
      >
        { formik => (
          <Form>
            <Dropdown
              name="tier"
              label="Tier *"
              opts={tierOpts}
              disabled={true}
            />
            <Dropdown
              name="cycle"
              label="Cycle *"
              opts={cycleOpts}
              disabled={isUpdate}
            />
            <TextInput
              label="Price Unit Amount *"
              name="unitAmount"
              type="number"
              disabled={isUpdate}
            />
            <TextInput
              label="Stripe Price ID *"
              name="stripePriceId"
              type="text"
              desc="The Stripe price id matching this price"
            />
            <TextInput
              label="Description"
              name="description"
              type="text"
            />
            <TextInput
              label="Nickname"
              name="nickname"
              type="text"
            />
            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text="Save"
              isSubmitting={formik.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
