import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';
import { InputGroup } from '../../components/controls/InputGroup';
import { TextInput } from '../../components/controls/TextInput';
import { invalidMessages } from '../../data/form-value';
import { SignUpParams, testAccountSuffix } from '../../data/reader-account';

export function SandboxAccountForm(
  props: {
    onSubmit: (
      values: SignUpParams,
      formikHelpers: FormikHelpers<SignUpParams>
    ) => void | Promise<any>;
  }
) {
  return (
    <Formik<SignUpParams>
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .required(invalidMessages.required)
          .test(
            'email',
            'Must not contain @ symbol',
            (value, context) => {
              return !!value && value.includes('@');
            }
          ),
        password: Yup.string().required(invalidMessages.required)
      })}
      onSubmit={props.onSubmit}
    >
      <Form>
        <EmailInput/>
        <TextInput
          label='Password *'
          name='password'
          type='text'
        />

        <FormikSubmitButton text='Create'/>
      </Form>
    </Formik>
  )
}

function EmailInput() {

  const {
    touched,
    values,
    setFieldValue,
  } = useFormikContext<SignUpParams>();

  useEffect(() => {
    const e = values.email.trim();

    if (e.includes('@')) {
      setFieldValue('email', e.split('@')[0]);
    }
  }, [values.email, touched.email]);

  return (
    <InputGroup
      controlId='email'
      type='text'
      label='Email *'
      suffix={
        <span
          className="input-group-text"
        >
          {testAccountSuffix}
        </span>
      }
    />
  );
}
