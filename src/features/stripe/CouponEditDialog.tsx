import Modal from 'react-bootstrap/Modal';
import { CMSPassport } from '../../data/cms-account';
import { StripeCoupon } from '../../data/stripe-price';
import { ModeBadge } from '../../components/text/Badge';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { CouponForm } from './CouponForm';
import { CouponCard } from './CouponCard';
import { useCoupon } from './useCoupon';
import { ReqConfig } from '../../http/ReqConfig';

export function CouponEditDialog(
  props: {
    config: ReqConfig
    coupon: StripeCoupon;
    show: boolean;
    onHide: () => void;
    onSaved: (c: StripeCoupon) => void;
  }
) {

  const {
    clear,
    updateCoupon,
  } = useCoupon();

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={() => {
        clear();
        props.onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          Edit coupon
        </Modal.Title>
        <ModeBadge live={props.config.live} />
      </Modal.Header>

      <Modal.Body>

        <FullscreenTwoCols
          right={
            <CouponForm
              onSubmit={
                updateCoupon(
                  props.coupon,
                  props.config,
                  props.onSaved,
                )
              }
              coupon={props.coupon}
            />
          }
        >
          <CouponCard
            coupon={props.coupon}
            menu={null}
          />
        </FullscreenTwoCols>
      </Modal.Body>
    </Modal>
  );
}
