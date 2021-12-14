import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Price } from '../../data/price';
import { PriceContent } from './PriceContent';
import { attachIntroPrice, dropIntroPrice } from '../../repository/paywall';
import { useRecoilValue } from 'recoil';
import { liveModeState } from '../../store/recoil-state';
import { CMSPassport } from '../../data/cms-account';
import { useState } from 'react';
import { ResponseError } from '../../repository/response-error';
import { toast } from 'react-toastify';
import { OnProductUpserted } from './callbacks';

export function IntroductoryDetails(
  props: {
    passport: CMSPassport;
    price: Price;
    onRefreshed: OnProductUpserted;
  }
) {

  const live = useRecoilValue(liveModeState);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ dropping, setDropping ] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);

    attachIntroPrice(
        props.price.productId,
        { priceId: props.price.id },
        { live, token: props.passport.token }
      )
      .then(prod => {
        setRefreshing(false);
        props.onRefreshed(prod);
      })
      .catch((err: ResponseError) => {
        setRefreshing(false);
        toast.error(err.message);
      });
  };

  const handleDrop = () => {
    setDropping(true);

    dropIntroPrice(
      props.price.productId,
      { live, token: props.passport.token }
    )
    .then(prod => {
      setDropping(false);
      props.onRefreshed(prod);
    })
    .catch((err: ResponseError) => {
      setDropping(false);
      toast.error(err.message);
    });
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <span>Introductory Price</span>
        <ButtonGroup size="sm">
          <Button
            variant="outline-primary"
            size="sm"
            disabled={refreshing || dropping}
            onClick={handleRefresh}
          >
            {
              refreshing
                ? 'Refreshing....'
                : 'Refresh'
            }
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={dropping || refreshing}
            onClick={handleDrop}
          >
            {
              dropping ? 'Dropping...' : 'Drop'
            }
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
