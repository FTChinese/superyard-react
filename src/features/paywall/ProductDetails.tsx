import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { TextList } from '../../components/list/TextList';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { ActiveBadge, ModeBadge } from './Badge';
import { ProductFormDialog } from './ProductFormDialog';
import { OnProductUpserted } from './callbacks';

export function ProductDetails(
  props: {
    passport: CMSPassport;
    product: Product;
    onUpdated: OnProductUpserted;
  }
) {

  const [ show, setShow ] = useState(false);

  const handleUpdate = (prod: Product) => {
    setShow(false);
    props.onUpdated(prod);
  };

  return (
    <>
      <Card>
        <Card.Header className="text-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShow(true)}
          >
            Edit
          </Button>
        </Card.Header>
        <Card.Body>
          <Card.Title className="text-center">
            {props.product.heading}
          </Card.Title>

          <Card.Subtitle className="mb-2 text-muted">
            Description
          </Card.Subtitle>
          <TextList
            text={props.product.description}
          />

          <Card.Subtitle className="mb-2 text-muted">
            Small Print
          </Card.Subtitle>
          {
          props.product.smallPrint ?
            <TextList text={props.product.smallPrint} /> :
            <p>NULL</p>
          }

          <table className="table table-borderless">
            <tbody>
              <tr>
                <th>Tier</th>
                <td>{props.product.tier}</td>
              </tr>
              <tr>
                <th>Mode</th>
                <td><ModeBadge live={props.product.liveMode}/></td>
              </tr>
              <tr>
                <th>Active</th>
                <td><ActiveBadge active={props.product.active} /></td>
              </tr>
              <tr>
                <th>Created</th>
                <td>At {props.product.createdUtc} by {props.product.createdBy}</td>
              </tr>
              <tr>
                <th>Update at</th>
                <td>{props.product.updatedUtc}</td>
              </tr>
            </tbody>
          </table>
        </Card.Body>
      </Card>

      <ProductFormDialog
        passport={props.passport}
        show={show}
        onHide={() => setShow(false)}
        onUpserted={handleUpdate}
        product={props.product}
      />
    </>
  );
}
