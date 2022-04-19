import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Flex } from '../../components/layout/Flex';
import { loadingErrored, ProgressOrError, loadingStarted, loadingStopped } from '../../components/progress/ProgressOrError';
import { Missing, Unauthorized } from '../../components/routes/Unauthorized';
import { StripeCoupon, StripePrice } from '../../data/stripe-price';
import { CouponFormDialog } from '../../features/stripe/CouponFromDialog';
import { CouponItem } from '../../features/stripe/CouponItem';
import { StripePriceDetail } from '../../features/stripe/StripePriceDetail';
import { loadStripeCoupons, loadStripePrice } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';

export function StripePricePage() {
  const { priceId } = useParams<'priceId'>();
  const { passport } = useAuth();
  const [ show, setShow ] = useState(false);
  const { live } = useLiveMode();

  const [ priceLoading, setPriceLoading ] = useState(loadingStopped);
  const [ stripePrice, setStripePrice ] = useState<StripePrice>();

  const [ couponsLoading, setCouponsLoading ] = useState(loadingStopped);
  const [ coupons, setCoupons ] = useState<StripeCoupon[]>();


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
          token: passport.token,
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

  useEffect(() =>{
    setCouponsLoading(loadingStarted());

    loadStripeCoupons(
        priceId,
        {
          live,
          token: passport.token
        }
      )
      .then(c => {
        setCouponsLoading(loadingStopped());
        setCoupons(c);
      })
      .catch((err: ResponseError) => {
        setCouponsLoading(loadingErrored(err.message));
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

        <ProgressOrError
          state={couponsLoading}
        >
          <>
            {
              coupons?.map(c => (
                <CouponItem
                  coupon={c}
                />
              ))
            }
          </>
        </ProgressOrError>
      </section>

      <CouponFormDialog
        show={show}
        onHide={() => setShow(false)}
        live={live}
      />
    </>
  );
}
