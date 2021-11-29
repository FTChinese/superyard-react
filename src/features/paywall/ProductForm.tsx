import { Form, Formik, FormikHelpers } from 'formik';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Tier, tierOpts } from '../../data/enum';
import { ProductParams } from '../../data/paywall';
import * as Yup from 'yup';
import { invalidMessages } from '../../data/form-value';
import { Dropdown } from '../../components/controls/Dropdown';
import { TextInput } from '../../components/controls/TextInput';
import { Textarea } from '../../components/controls/Textarea';
import ProgressButton from '../../components/buttons/ProgressButton';

export type CreateProductFormVal = {
  tier: Tier | string;
  heading: string;
  description: string;
  smallPrint: string;
};

export function convertProductForm(v: CreateProductFormVal, by: string): ProductParams {
  return {
    createdBy: by,
    description: v.description,
    heading: v.heading,
    smallPrint: v.smallPrint || undefined,
    tier: v.tier as Tier,
  };
}

export function ProductForm(
  props: {
    onSubmit: (
      values: CreateProductFormVal,
      formikHelpers: FormikHelpers<CreateProductFormVal>
    ) => void | Promise<any>;
    errMsg: string;
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
      <Formik<CreateProductFormVal>
        initialValues={{
          tier: '',
          heading: '',
          description: '',
          smallPrint: '',
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
              isSubmitting={formik.isSubmitting}/>
          </Form>
        )}
      </Formik>
    </>
  );
}
