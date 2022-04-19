import { Form, Formik, FormikHelpers } from 'formik';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Tier, tierOpts } from '../../data/enum';
import { NewProductParams, Product, UpdateProductParams } from '../../data/paywall';
import * as Yup from 'yup';
import { invalidMessages } from '../../data/form-value';
import { Dropdown } from '../../components/controls/Dropdown';
import { TextInput } from '../../components/controls/TextInput';
import { Textarea } from '../../components/controls/Textarea';
import ProgressButton from '../../components/buttons/ProgressButton';

export type ProductFormVal = {
  tier: Tier;
  heading: string;
  description: string;
  smallPrint: string;
};

export function buildNewProductParams(v: ProductFormVal, by: string): NewProductParams {
  return {
    tier: v.tier,
    createdBy: by,
    description: v.description,
    heading: v.heading,
    smallPrint: v.smallPrint || undefined,
  };
}

export function buildUpdateProductParams(v: ProductFormVal): UpdateProductParams {
  return {
    description: v.description,
    heading: v.heading,
    smallPrint: v.smallPrint || undefined,
  };
}

export function ProductForm(
  props: {
    onSubmit: (
      values: ProductFormVal,
      formikHelpers: FormikHelpers<ProductFormVal>
    ) => void | Promise<any>;
    errMsg: string;
    product?: Product; // Exists when updating.
  }
) {
  const [errMsg, setErrMsg] = useState('');

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
      <Formik<ProductFormVal>
        initialValues={{
          tier: props.product?.tier || ('' as Tier), // This is hack.
          heading: props.product?.heading || '',
          description: props.product?.description || '',
          smallPrint: props.product?.smallPrint || '',
        }}
        validationSchema={Yup.object({
          tier: Yup.string().required(invalidMessages.required),
          heading: Yup.string().required(invalidMessages.required),
          description: Yup.string().required(invalidMessages.required),
        })}
        onSubmit={props.onSubmit}
      >
        { formik => (
          <Form>
            <Dropdown
              name="tier"
              label="Tier *"
              opts={tierOpts}
              disabled={!!props.product?.tier}
            />
            <TextInput
              label="Heading *"
              name="heading"
              type="text"
            />
            <Textarea
              label="Description *"
              name="description"
              rows={10}
              desc="{{}} and content inside it are placeholders. Do not touch them unless you really mean to remove them."
            />
            <Textarea
              label="Small Print"
              name="smallPrint"
              rows={5}
              desc="Optional legal terms and conditions"
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
