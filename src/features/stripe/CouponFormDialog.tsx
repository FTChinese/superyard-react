import Modal from 'react-bootstrap/Modal';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { ModeBadge } from '../../components/text/Badge';

export function CouponFormDialog(
  props: {
    show: boolean,
    onHide: () => void;
    live: boolean;
  }
) {
  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          Create Coupon
        </Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>

          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}
