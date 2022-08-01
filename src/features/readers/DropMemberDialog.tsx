import { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { LoadButton } from '../../components/buttons/Button';
import { useMemberState } from './useMemberState';
import { toast } from 'react-toastify';

export function DropMemberDialog(
  props: {
    token: string;
    compoundId: string;
    show: boolean;
    onHide: () => void;
    onDropped: () => void;
  }) {

  const {
    progress,
    errMsg,
    dropMember,
  } = useMemberState();

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        Delete Membership
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this user's membership?</p>
      </Modal.Body>

      <Modal.Footer>
        <LoadButton
          text='Delete'
          progress={progress}
          onClick={() => {
            dropMember(props.token, props.compoundId)
              .then(ok => {
                if (ok) {
                  props.onDropped();
                }
              });
          }}
          variant='danger'
        />
      </Modal.Footer>
    </Modal>
  );
}
