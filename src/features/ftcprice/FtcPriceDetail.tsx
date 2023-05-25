import Card from 'react-bootstrap/Card';
import { PaywallPrice } from '../../data/paywall';
import { localizedTier } from '../../data/localization';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { newFtcPriceParts } from '../../data/ftc-price';
import { PriceTable } from './PriceTable';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

/**
 * FtcPriceDetail presents ftc price's fields in
 * a bootstrap card.
 */
export function FtcPriceDetail(
  props: {
    price: PaywallPrice;
    progress: boolean;
    onEdit: () => void;
    onActivate: () => void;
    onArchive: () => void;
  }
) {
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <span>{localizedTier(props.price.tier)}</span>
        <ButtonGroup size="sm">
          {
            !props.price.active &&
            <Button
              variant="outline-primary"
              size="sm"
              disabled={props.progress}
              onClick={props.onActivate}
            >
              Activate
            </Button>
          }
          {
            !props.price.active &&
            <Button
              variant="danger"
              size="sm"
              disabled={props.progress}
              onClick={props.onArchive}
            >
              Archive
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
          <PriceHighlight
            parts={newFtcPriceParts(props.price)}
          />
        </Card.Title>

        <PriceTable
          price={props.price}
        />
      </Card.Body>
    </Card>
  )
}
