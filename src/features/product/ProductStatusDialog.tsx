import Modal from 'react-bootstrap/Modal';
import { Product } from '../../data/paywall';
import { ReqConfig } from '../../http/ReqConfig';
import { useProductUpsert } from './useProductUpsert';
import { ModeBadge } from '../../components/text/Badge';
import { LoadButton } from '../../components/buttons/Button';

export function ProductStatusDialog(
  props: {
    config: ReqConfig;
    product: Product;
    show: boolean;
    onHide: () => void;
    onSaved: (p: Product) => void;
  }
) {
  const {
    activateProduct,
    activating,
  } = useProductUpsert();

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className='me-3'>
          Activating this product?
        </Modal.Title>
        <ModeBadge live={props.config.live} />
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to activate this product? Current product of the same tier will be replaced by this one together with the prices attached to it.
      </Modal.Body>

      <Modal.Footer>
        <LoadButton
          text='Yes'
          disabled={activating}
          onClick={() => {
            activateProduct(
              props.product.id,
              props.config,
              props.onSaved,
            );
          }}
          progress={activating}
        />
      </Modal.Footer>
    </Modal>
  );
}
