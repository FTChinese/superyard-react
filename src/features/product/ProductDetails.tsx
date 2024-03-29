import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { TextList } from '../../components/list/TextList';
import { Product } from '../../data/paywall';
import { ActiveBadge, ModeBadge } from '../../components/text/Badge';
import { ButtonGroup } from 'react-bootstrap';

export function ProductDetails(
  props: {
    product: Product;
    onEdit: () => void;
    onActivate: () => void;
  }
) {

  return (
    <Card>
      <Card.Header className="text-end">
        <ButtonGroup size="sm">
          {
            !props.product.active &&
            <Button
              variant="outline-primary"
              size="sm"
              onClick={props.onActivate}
            >
              Activate
            </Button>
          }
          <Button
            variant="primary"
            size="sm"
            onClick={props.onEdit}
          >
            Edit
          </Button>
        </ButtonGroup>

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
  );
}
