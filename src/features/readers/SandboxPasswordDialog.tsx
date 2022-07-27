import { FormikHelpers } from 'formik';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { CMSPassport } from '../../data/cms-account';
import { SandboxPwParams, TestAccount } from '../../data/reader-account';
import { ResponseError } from '../../http/response-error';
import { changeSandboxPassword } from '../../repository/reader';
import { SandboxPasswordForm } from './SandboxPasswordForm';

export function SandboxPasswordDialog(
  props: {
    passport: CMSPassport;
    user: TestAccount;
    show: boolean;
    onHide: () => void;
    onChanged: (a: TestAccount) => void;
  }
) {
  const onSubmit = (values: SandboxPwParams, helpers: FormikHelpers<SandboxPwParams>) => {
    helpers.setSubmitting(true);

    changeSandboxPassword(
      props.passport.token,
      props.user.id,
      values
    )
      .then(a => {
        props.onChanged(a);
        props.onHide();
      })
      .catch((err: ResponseError) => {
        toast.error(err.message);
      })
      .finally(() => {
        helpers.setSubmitting(false);
      });
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SandboxPasswordForm
          onSubmit={onSubmit}
        />
      </Modal.Body>
    </Modal>
  )
}
