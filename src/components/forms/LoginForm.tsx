import { Formik, Form, FormikHelpers } from "formik";
import Alert from "react-bootstrap/Alert";
import { invalidMessages } from "../../data/form-value";
import { TextInput } from "../controls/TextInput";
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { CMSCredentials } from '../../data/cms-account';
import { FormikSubmitButton } from '../controls/FormikSubmitButton';

/**
 * @description A form to collect email login data, used for:
 * - Login with email
 * - New mobile user links to an existing email account
 * - Wechat user links to existing email.
 */
export function LoginForm(
  props: {
    onSubmit: (
      values: CMSCredentials,
      formikHelpers: FormikHelpers<CMSCredentials>
    ) => void | Promise<any>;
    errMsg: string;
    btnText: string;
    email: string;
  }
) {

  const [errMsg, setErrMsg] = useState('')

  // Sync props error message to state.
  // Must use props.errMsg to detect changes.
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
          onClose={() => setErrMsg('')}
        >
          {errMsg}
        </Alert>
      }
      <Formik<CMSCredentials>
        initialValues={{
          userName: '',
          password: '',
        }}
        validationSchema={Yup.object({
          userName: Yup.string()
            .required(invalidMessages.required),
          password: Yup.string()
            .required(invalidMessages.required)
        })}
        onSubmit={props.onSubmit}
      >
        <Form>
          <TextInput
            label="Username"
            name="userName"
            type="text"
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
          />

          <FormikSubmitButton
            text={props.btnText}
          />
        </Form>
      </Formik>
    </>
  );
}
