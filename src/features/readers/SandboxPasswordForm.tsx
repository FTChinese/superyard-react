import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';
import { TextInput } from '../../components/controls/TextInput';
import { invalidMessages } from '../../data/form-value';
import { SandboxPwParams } from '../../data/reader-account'

export function SandboxPasswordForm(
  props: {
    onSubmit: (
      values: SandboxPwParams,
      formikHelpers: FormikHelpers<SandboxPwParams>
    ) => void | Promise<any>
  }
) {

  return (
    <Formik<SandboxPwParams>
      initialValues={{
        password: ''
      }}
      validationSchema={Yup.object({
        password: Yup
          .string()
          .required(invalidMessages.required)
      })}
      onSubmit={props.onSubmit}
    >
      <Form>
        <TextInput
          label='New Password *'
          name='password'
          type='text'
        />

        <FormikSubmitButton text='Change'/>
      </Form>
    </Formik>
  );
}
