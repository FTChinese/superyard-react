import { FormikHelpers } from 'formik';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { CMSPassport } from '../../data/cms-account';
import { TestAccount, SignUpParams, newSandboxSignUp } from '../../data/reader-account';
import { ResponseError } from '../../http/response-error';
import { createSandboxUser } from '../../repository/reader';
import { SandboxAccountForm } from './SandboxAccountForm';

export function SandboxAccountDialog(
  props: {
    passport: CMSPassport;
    show: boolean;
    onHide: () => void;
    onCreated: (a: TestAccount) => void;
  }
) {

  const onSubmit = (values: SignUpParams, helpers: FormikHelpers<SignUpParams>) => {
    helpers.setSubmitting(true);

    createSandboxUser(props.passport.token, newSandboxSignUp(values))
      .then(a => {
        props.onCreated(a);
        props.onHide();
      })
      .catch((err: ResponseError) => {
        toast.error(err.message);
      })
      .finally(() => {
        helpers.setSubmitting(false)
      })
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>New Sandbox Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Test account always ends with <strong>.test@ftchinese.com</strong>. Do not enter the host part. Simply specify the name prefix will work.</p>

        <SandboxAccountForm
          onSubmit={onSubmit}
        />
      </Modal.Body>
    </Modal>
  )
}
