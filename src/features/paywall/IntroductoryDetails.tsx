import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Price } from '../../data/price';
import { PriceContent } from './PriceContent';

export function IntroductoryDetails(
  props: {
    price?: Price
  }
) {
  if (!props.price) {
    return (
      <Card>
        <Card.Body>
          Not set
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <span>Introductory Price</span>
        <ButtonGroup size="sm">
          <Button
            variant="outline-primary"
            size="sm"
          >
            Refresh
          </Button>
          <Button
            variant="danger"
            size="sm"
          >
            Drop
          </Button>
        </ButtonGroup>
      </Card.Header>

      <Card.Body>
        <PriceContent
          price={props.price}
        />
      </Card.Body>
    </Card>
  );
}
