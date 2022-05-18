import Modal from 'react-bootstrap/Modal';

export function FullscreenDialog(
  props: {
    show: boolean;
    title: string;
    onHide: () => void;
    children: JSX.Element;
  }
) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      fullscreen={true}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      { props.children }
      </Modal.Body>
    </Modal>
  );
}
