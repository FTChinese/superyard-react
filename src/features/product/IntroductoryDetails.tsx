import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ftcPriceFormat, Price } from '../../data/ftc-price';
import { attachIntroPrice, dropIntroPrice } from '../../repository/paywall';
import { CMSPassport } from '../../data/cms-account';
import { useEffect, useState } from 'react';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { OnProductUpserted } from './callbacks';
import { PriceTable } from './PriceTable';

export function IntroductoryDetails(props: {
  passport: CMSPassport;
  price: Price;
  // If the price is updated, auto refresh so that data in product table and price table is synced.
  updated: boolean;
  onRefreshOrDrop: OnProductUpserted;
}) {
  const { live } = useLiveMode();
  const [refreshing, setRefreshing] = useState(false);
  const [dropping, setDropping] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);

    attachIntroPrice(
      props.price.productId,
      { priceId: props.price.id },
      { live, token: props.passport.token }
    )
      .then((prod) => {
        setRefreshing(false);
        props.onRefreshOrDrop(prod);
      })
      .catch((err: ResponseError) => {
        setRefreshing(false);
        toast.error(err.message);
      });
  };

  const handleDrop = () => {
    setDropping(true);

    dropIntroPrice(props.price.productId, { live, token: props.passport.token })
      .then((prod) => {
        setDropping(false);
        props.onRefreshOrDrop(prod);
      })
      .catch((err: ResponseError) => {
        setDropping(false);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (!props.updated) {
      return;
    }

    handleRefresh();
  }, [props.updated]);

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <span>{ftcPriceFormat(props.price).format()}</span>
        <ButtonGroup size="sm">
          <Button
            variant="outline-primary"
            size="sm"
            disabled={refreshing || dropping}
            onClick={handleRefresh}
          >
            {refreshing ? 'Refreshing....' : 'Refresh'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={dropping || refreshing}
            onClick={handleDrop}
          >
            {dropping ? 'Dropping...' : 'Drop'}
          </Button>
        </ButtonGroup>
      </Card.Header>

      <Card.Body>
        <PriceTable price={props.price} />
      </Card.Body>
    </Card>
  );
}
