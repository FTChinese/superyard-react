import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { PaywallPrice } from '../../data/paywall';
import { formatPrice } from '../../utils/format-price';
import { ActiveBadge } from './Badge';
import { DiscountList } from './DiscountList';
import { useState } from 'react';
import { PriceFormDialog } from './PriceFormDialog';
import { CMSPassport } from '../../data/cms-account';
import { PriceContent } from './PriceContent';
import { OnPriceUpserted } from './callbacks';
import { activatePrice, archivePrice } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { liveModeState } from '../../store/recoil-state';

export function PriceListItem(
  props: {
    passport: CMSPassport;
    price: PaywallPrice;
    onUpdated: OnPriceUpserted;
    onActivated: OnPriceUpserted;
    onArchived: OnPriceUpserted;
  }
) {

  const live = useRecoilValue(liveModeState);
  const [ show, setShow ] = useState(false);
  const [ activating, setActivating ] = useState(false);
  const [ archiving, setArchiving ] = useState(false);

  const handleActivation = () => {
    setActivating(true);

    activatePrice(
        props.price.id,
        { live, token: props.passport.token }
      )
      .then(pwp => {
        toast.success('Price activated');
        props.onActivated(pwp);
      })
      .catch((err: ResponseError) => {
        toast.error(err.message);
      })
  };

  const handleUpdate: OnPriceUpserted = (price: PaywallPrice) => {
    setShow(false);
    props.onUpdated(price);
  }

  const handleArchive = () => {
    setArchiving(true);

    archivePrice(
        props.price.id,
        { live, token: props.passport.token }
      )
      .then(pwp => {
        setArchiving(false);
        props.onArchived(pwp);
      })
      .catch((err: ResponseError) => {
        setArchiving(false);
        toast.error(err.message);
      });
  }

  return (
    <div className="mb-3">
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <div>
            <span className="me-2">
              {formatPrice(props.price)}
            </span>
            {
              props.price.active &&
              <ActiveBadge active={true}/>
            }
          </div>

          <ButtonGroup
            size="sm"
          >
            {
              !props.price.active &&
              <>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={archiving}
                  onClick={handleArchive}
                >
                  { archiving ? 'Dropping ' : 'Archive'}
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={activating}
                  onClick={handleActivation}
                >
                  { activating ? 'Activating...' : 'Activate' }
                </Button>
              </>
            }
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShow(true)}
            >
              Edit
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Body>
          <PriceContent
            price={props.price}
          />
        </Card.Body>
      </Card>

      <DiscountList
        passport={props.passport}
        price={props.price}
        onUpdatePrice={props.onUpdated}
      />
      <PriceFormDialog
        passport={props.passport}
        show={show}
        onHide={() => setShow(false)}
        onUpserted={handleUpdate}
        price={props.price}
      />
    </div>
  );
}
