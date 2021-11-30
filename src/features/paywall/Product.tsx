import Card from 'react-bootstrap/Card';
import { TextList } from '../../components/list/TextList';
import { Product } from '../../data/paywall';
import { ActiveBadge, ModeBadge } from './Badge';

export function ProductDetails(
  props: {
    product: Product;
  }
) {
  return (
    <Card>
      <Card.Header className="text-end">
        <button className="btn btn-link">Edit</button>
      </Card.Header>
      <Card.Body>
        <Card.Title className="text-center">{props.product.heading}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Description</Card.Subtitle>
        <TextList text={props.product.description} />
        <Card.Subtitle className="mb-2 text-muted">Small Print</Card.Subtitle>
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
              <td>at {props.product.createdUtc} by {props.product.createdBy}</td>
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
