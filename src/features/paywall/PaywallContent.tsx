import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ImageRatio } from '../../components/graphics/ImageRatio';
import { JSONBlock } from '../../components/JSONBlock';
import { TextList } from '../../components/list/TextList';
import { CMSPassport } from '../../data/cms-account';
import { Banner, Paywall, PaywallDoc, PaywallProduct, Promo } from '../../data/paywall';
import { Discount, Price } from '../../data/price';
import { dropPromo, saveBanner, savePromo } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { formatYearMonthDay } from '../../utils/format-datetime';
import { formatPrice } from '../../utils/format-price';
import { ModeBadge } from './Badge';
import { BannerFormVal, buildBannerParams, BannerForm, buildPromoParams } from './BannerForm';
import { EffectivePeriod } from './EffectivePeriod';
import { useRecoilValue } from 'recoil';
import { liveModeState } from '../../store/recoil-state';


export function PaywallContent(
  props: {
    passport: CMSPassport;
    paywall: Paywall;
  }
) {

  return (
    <div>
      <BannerCard banner={props.paywall.banner} passport={props.passport} />
      <PromoCard promo={props.paywall.promo} passport={props.passport} />
      <div className="row row-cols-1 row-cols-md-2">
        {
          props.paywall.products.map(product => (
            <div
              className="col"
              key={product.id}
            >
              <ProductCard
                product={product}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}

/**
 * @description - BannerBox shows a banner's content shared by default banner and promo banner.
 */
 function BannerBox(
  props: {
    banner: Banner;
  }
) {
  return (
    <div className="row flex-row-reverse">
      <div className="col-sm-4">
        <ImageRatio src={props.banner.coverUrl} />
      </div>

      <div className="col-sm-8">
        <h1 className="card-title">{props.banner.heading}</h1>
        <h2 className="card-subtitle">{props.banner.subHeading}</h2>

        <div>{props.banner.content}</div>
      </div>
    </div>
  );
}

function BannerCard(
  props: {
    passport: CMSPassport;
    banner: Banner;
  }
) {

  const live = useRecoilValue(liveModeState);
  const [ show, setShow ] = useState(false);
  const [ err, setErr ] = useState('');
  const [ paywallDoc, setPaywallDoc] = useState<PaywallDoc>();

  const modalTitle = (props.banner.id === '') ? 'Create Banner' : 'Edit Banner';

  const handleSubmit = (
    values: BannerFormVal,
    helpers: FormikHelpers<BannerFormVal>
  ) => {
    helpers.setSubmitting(true);
    setErr('');
    console.log(values);

    const params = buildBannerParams(values);

    saveBanner(
        params,
        { live, token: props.passport.token }
      )
      .then(pwd => {
        helpers.setSubmitting(false);
        setPaywallDoc(pwd);
        toast.info('Saved! Click Rebuild button to bust cach.')
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        toast.error(err.message);
        if (err.statusCode === 422) {
          helpers.setErrors(err.toFormFields);
          return;
        }
        setErr(err.message);
      });
  }

  return (
    <>
      <Card className="card mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Default Banner</span>
          <Button
            size="sm"
            onClick={() => setShow(true)}
          >
            Edit
          </Button>
        </Card.Header>

        <Card.Body className="card-body">
          <BannerBox banner={props.banner} />
        </Card.Body>
      </Card>

      <Modal
        show={show}
        fullscreen={true}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title className="me-3">{modalTitle}</Modal.Title>
          <ModeBadge live={live} />
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row row-cols-1 row-cols-md-2">
              <div className="col">
                <BannerForm
                  onSubmit={handleSubmit}
                  initial={props.banner}
                  errMsg={err}
                />
              </div>
              <div className="col">
                {
                  paywallDoc &&
                  <JSONBlock value={paywallDoc} />
                }
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function PromoCard(
  props: {
    passport: CMSPassport;
    promo: Promo;
  }
) {

  const isEmpty = props.promo.id === '';

  const live = useRecoilValue(liveModeState);
  const [ show, setShow ] = useState(false);
  const [ err, setErr ] = useState('');
  const [ paywallDoc, setPaywallDoc] = useState<PaywallDoc>();
  const [ dropping, setDropping ] = useState(false);

  const handleSubmit = (
    values: BannerFormVal,
    helpers: FormikHelpers<BannerFormVal>
  ) => {
    helpers.setSubmitting(true);
    setErr('');
    console.log(values);

    const params = buildPromoParams(values);

    savePromo(
        params,
        { live, token: props.passport.token }
      )
      .then(pwd => {
        helpers.setSubmitting(false);
        setPaywallDoc(pwd);
        toast.info('Saved! Click Rebuild button to bust cach.')
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        toast.error(err.message);
        if (err.statusCode === 422) {
          helpers.setErrors(err.toFormFields);
          return;
        }
        setErr(err.message);
      });
  };

  const handleDrop = () => {
    setDropping(true);

    dropPromo({ live, token: props.passport.token})
      .then(pwd => {
        console.log(pwd);
        setDropping(false);
        toast.success('Dropped. Please rebuild paywall.')
      })
      .catch((err: ResponseError) => {
        setDropping(false);
        toast.error(err.message);
      })
  };

  const hideDialog = () => {
    setPaywallDoc(undefined);
    setShow(false);
  };

  const body = (props.promo.id === '')
    ? (<p>Not promotion set.</p>)
    : (
      <>
        <BannerBox banner={props.promo} />

        <Card.Title className="mt-3">
          Terms and Conditions
        </Card.Title>
        { props.promo.terms && <TextList text={props.promo.terms} />}

        <Card.Subtitle className="mt-3">
          Effective
        </Card.Subtitle>
        <EffectivePeriod
          period={props.promo}
          direction="column"
        />
      </>
    );

  return (
    <>
      <Card className="card mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Promotion Banner</span>

          <ButtonGroup>
            { !isEmpty &&
              <Button
                variant="danger"
                size="sm"
                onClick={handleDrop}
              >
                { dropping ? 'Processing' : 'Drop'}
              </Button>
            }
            <Button
              size="sm"
              onClick={() => setShow(true)}
            >
               New
            </Button>
          </ButtonGroup>
        </Card.Header>

        <Card.Body className="card-body">
          {body}
        </Card.Body>
      </Card>

      <Modal
        show={show}
        fullscreen={true}
        onHide={hideDialog}
      >
        <Modal.Header closeButton>
          <Modal.Title className="me-3">Create Promotion Banner</Modal.Title>
          <ModeBadge live={live} />
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row row-cols-1 row-cols-md-2">
              <div className="col">
                <BannerForm
                  onSubmit={handleSubmit}
                  initial={props.promo}
                  errMsg={err}
                  hasPeriod={true}
                />
              </div>
              <div className="col">
                {
                  paywallDoc && <pre><code>{JSON.stringify(paywallDoc, undefined, 4)}</code></pre>
                }
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function ProductCard(
  props: {
    product: PaywallProduct;
  }
) {
  return (
    <Card className="h-100">
      <Card.Header className="text-end">
        <Link to={`products/${props.product.id}`}>
          Details
        </Link>
      </Card.Header>
      <Card.Body>

        <Card.Title as="h5" className="text-center border-bottom">
          {props.product.heading}
        </Card.Title>
        <TextList text={props.product.description}/>

        {
          props.product.introductory &&
          <PriceOverview
            price={props.product.introductory}
          />
        }

        {
          props.product.prices.map((p, i) => (
            <PriceOverview
              key={i}
              price={p}
              offers={p.offers}
            />
          ))
        }
      </Card.Body>
    </Card>
  );
}

function PriceOverview(
  props: {
    price: Price;
    offers?: Discount[];
  }
) {
  return (
    <section className="mb-5">
      <h6 className="text-center border-bottom">
        {formatPrice(props.price)}
      </h6>
      <dl>
        <dt>Kind</dt>
        <dd>{props.price.kind}</dd>

        <dt>Period Count</dt>
        <dd>{formatYearMonthDay(props.price.periodCount)}</dd>

        <dt>Stripe Price ID</dt>
        <dd>{props.price.stripePriceId || 'NULL'}</dd>
      </dl>
      {
        props.offers &&
        <PriceOfferList offers={props.offers} />
      }
    </section>
  );
}

function PriceOfferList(
  props: {
    offers: Discount[];
  }
) {

  if (props.offers.length == 0) {
    return <></>;
  }

  return (
    <table className="table table-sm table-borderless align-middle table-striped caption-top">
      <caption>Offers</caption>
      <thead>
        <tr>
          <th>Kind</th>
          <th>Override Period</th>
          <th>Price Off</th>
          <th>Effective</th>
        </tr>
      </thead>
      <tbody>
        {
          props.offers.map((o, i) => (
            <PriceOfferRow offer={o} key={i} />
          ))
        }
      </tbody>
    </table>
  );
}

function PriceOfferRow(
  props: {
    offer: Discount;
  }
) {
  return (
    <tr>
      <td>{props.offer.kind}</td>
      <td>{formatYearMonthDay(props.offer.overridePeriod)}</td>
      <td>{props.offer.priceOff}</td>
      <td>
        <EffectivePeriod period={props.offer} direction="column" />
      </td>
    </tr>
  );
}


