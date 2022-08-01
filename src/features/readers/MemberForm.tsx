import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Dropdown } from '../../components/controls/Dropdown';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';
import { TextInput } from '../../components/controls/TextInput';
import { PaymentKind, payMethodOpts, SelectOption } from '../../data/enum';
import { invalidMessages } from '../../data/form-value';
import { MemberParams, Membership } from '../../data/membership';

/**
 * @description MemberForm is used to collect user input to create/update membership.
 */
export function MemberForm(
  props: {
    priceOptions: SelectOption<string>[];
    current: Membership;
    onSubmit: (
      values: MemberParams,
      formikHelpers: FormikHelpers<MemberParams>
    ) => void | Promise<any>,
  }
) {

  return (
    <Formik<MemberParams>
      initialValues={{
        priceId: props.current.ftcPlanId || '' ,
        expireDate: props.current.expireDate || '',
        payMethod: props.current.payMethod || ('' as PaymentKind),
      }}
      validationSchema={Yup.object({
        priceId: Yup.string()
          .required(invalidMessages.required),
        expireDate: Yup.string()
          .required(invalidMessages.required),
        payMethod: Yup.string()
          .required(invalidMessages.required)
      })}
      onSubmit={props.onSubmit}
    >
      <Form>
        <Dropdown
          label='Price'
          name='priceId'
          opts={props.priceOptions}
        />
        <TextInput
          label='Expiration Date'
          name='expireDate'
          type='date'
        />
        <Dropdown
          label='Payment Method'
          name='payMethod'
          opts={payMethodOpts}
        />

        <FormikSubmitButton text="Save" />
      </Form>
    </Formik>
  )
}
