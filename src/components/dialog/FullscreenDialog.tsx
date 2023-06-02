import Modal from 'react-bootstrap/Modal';

export function FullscreenDialog(
  props: {
    show: boolean;
    onHide: () => void;
    title: string;
    children: JSX.Element;
    headerExtra: JSX.Element | null;
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
        {props.headerExtra}
      </Modal.Header>
      <Modal.Body>
      { props.children }
      </Modal.Body>
    </Modal>
  );
}
