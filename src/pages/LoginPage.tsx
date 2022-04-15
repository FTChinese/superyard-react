import { Link, Navigate } from 'react-router-dom';
import { sitemap } from '../data/sitemap';
import { login } from '../repository/auth';
import { ResponseError } from '../repository/response-error';
import { useState } from 'react';
import { FormikHelpers } from 'formik';
import { LoginForm } from '../components/forms/LoginForm';
import { CMSCredentials } from '../data/cms-account';
import { useAuth } from '../components/hooks/useAuth';

function Login() {
  const { setLogin, passport } = useAuth();
  const [ errMsg, setErrMsg ] = useState('');

  const handleSubmit = (
    values: CMSCredentials,
    helper: FormikHelpers<CMSCredentials>
  ): void | Promise<any> => {
    setErrMsg('');
    helper.setSubmitting(true);

    login(values)
      .then(passport => {
        helper.setSubmitting(false);
        setLogin(passport, () => {

        });
      })
      .catch((err: ResponseError) => {
        helper.setSubmitting(false);
        if (err.invalid) {
          helper.setErrors(err.toFormFields);
          return;
        }
        setErrMsg(err.message);
      });
  }

  return (
    <>
      {passport && (
        <Navigate to={sitemap.paywall} replace={true} />
      )}
      <LoginForm
        onSubmit={handleSubmit}
        errMsg={errMsg}
        btnText="Login"
        email=''
      />

      <div className="d-flex justify-content-between mt-3">
        <Link to={sitemap.forgotPassword}>Forgot password?</Link>
      </div>
    </>
  );
}

export function LoginPage() {
  return (
    <>
      <h4 className="text-center">Superyard Login</h4>
      <Login/>
    </>
  );
}
