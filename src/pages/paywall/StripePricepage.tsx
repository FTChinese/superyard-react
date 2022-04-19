import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Flex } from '../../components/layout/Flex';
import { loadingErrored, ProgressOrError, loadingStarted, loadingStopped } from '../../components/progress/ProgressOrError';
import { Missing, Unauthorized } from '../../components/routes/Unauthorized';
import { StripePrice } from '../../data/stripe-price';
import { CouponFormDialog, StripePriceDetail } from '../../features/stripe/StripePriceDetail';
import { loadStripePrice } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';

export function StripePricePage() {
  const { priceId } = useParams<'priceId'>();
  const { passport } = useAuth();
  const [ show, setShow ] = useState(false);
  const { live } = useLiveMode();

  const [ priceLoading, setPriceLoading ] = useState(loadingStopped);
  const [ stripePrice, setStripePrice ] = useState<StripePrice>();

  if (!priceId) {
    return <Missing message="Missing price id"/>;
  }

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    setPriceLoading(loadingStarted());
    setStripePrice(undefined);

    loadStripePrice(
        priceId,
        {
          live,
          token: passport?.token,
        }
      )
      .then(sp => {
        setPriceLoading(loadingStopped());
        setStripePrice(sp);
      })
      .catch((err: ResponseError) => {
        setPriceLoading(loadingErrored(err.message));
      });

  }, [live]);

  return (
    <>
      <section className="mb-3">
        <h4>Stripe Price Details</h4>

        <ProgressOrError
          state={priceLoading}
        >
          <>
            {
              stripePrice &&
              <StripePriceDetail
                price={stripePrice}
              />
            }
          </>
        </ProgressOrError>
      </section>

      <section className="mb-3">

        <Flex>
          <>
            <h4>Price Coupons</h4>
            <Button
              variant="primary"
              onClick={() => setShow(true)}
            >
              New
            </Button>
          </>
        </Flex>
      </section>

      <CouponFormDialog
        show={show}
        onHide={() => setShow(false)}
        live={live}
      />
    </>
  );
}