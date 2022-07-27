import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { OButton, SpinnerOrText } from '../../components/buttons/Button';
import { CMSPassport } from '../../data/cms-account';
import { TestAccount } from '../../data/reader-account';
import { ResponseError } from '../../http/response-error';
import { deleteSandboxUser } from '../../repository/reader';

export function SandboxDeleteDialog(
  props: {
    passport: CMSPassport;
    user: TestAccount,
    show: boolean,
    onHide: () => void;
    onDeleted: () => void;
  }
) {

  const [progress, setProgress] = useState(false);

  const onDelete = () => {
    setProgress(true);

    deleteSandboxUser(props.passport.token, props.user.id)
      .then(ok => {
        if (ok) {
          props.onDeleted();
        } else {
          toast.error('Failed');
        }
      })
      .catch((err: ResponseError) => {
        toast.error(err.message);
      })
      .finally(() => {
        setProgress(false);
      })
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this sandbox account?</p>
      </Modal.Body>
      <Modal.Footer>
        <OButton
          onClick={onDelete}
          variant="danger"
        >
          <SpinnerOrText
            text='Delete'
            progress={progress}
          />
        </OButton>
      </Modal.Footer>
    </Modal>
  );
}
