import Modal from 'react-bootstrap/Modal';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { ModeBadge } from '../../components/text/Badge';
import {
  ProductForm,
} from './ProductForm';
import { useProductUpsert } from './useProductUpsert';
import { SingleCenterCol } from '../../components/layout/ContentLayout';

/**
 * @description ProductFormDialog is used to prsent ProductForm when
 * creating a new product, or updating an existing one.
 */
export function ProductUpsertDialog(props: {
  passport: CMSPassport;
  live: boolean;
  show: boolean;
  onHide: () => void;
  onUpserted: (product: Product) => void;
  product?: Product;
}) {

  const {
    updateProduct,
  } = useProductUpsert();

  return (
    <Modal show={props.show} fullscreen={true} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          {props.product ? 'Update' : 'Create'} Product
        </Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>
      <Modal.Body>
        <SingleCenterCol>
          <ProductForm
            onSubmit={updateProduct({
              passport: props.passport,
              live: props.live,
              onSaved: props.onUpserted,
              product: props.product,
            })}
            product={props.product}
          />
        </SingleCenterCol>
      </Modal.Body>
    </Modal>
  );
}
