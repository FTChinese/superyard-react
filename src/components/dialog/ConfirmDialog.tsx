import Modal from 'react-bootstrap/Modal';
import { ModeBadge } from '../text/Badge';
import { LoadButton } from '../buttons/Button';

export function ConfirmDialog(
  props: {
    show: boolean;
    onHide: () => void;
    title: string;
    body: string;
    live: boolean;
    onConfirm: () => void;
    progress: boolean;
  }
) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className='me-3'>
          {props.title}
        </Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        {props.body}
      </Modal.Body>

      <Modal.Footer>
        <LoadButton
          text='Yes'
          disabled={props.progress}
          onClick={props.onConfirm}
          progress={props.progress}
        />
      </Modal.Footer>
    </Modal>
  )
}
