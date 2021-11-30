import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ImageRatio } from '../../components/graphics/ImageRatio';
import { TextList } from '../../components/list/TextList';
import { CMSPassport } from '../../data/cms-account';
import { Banner, Paywall, PaywallDoc, PaywallProduct, Promo } from '../../data/paywall';
import { Price } from '../../data/price';
import { saveBanner, savePromo } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { useLiveState } from '../../store/useLiveState';
import { formatPrice } from '../../utils/format-price';
import { ModeBadge } from './Badge';
import { BannerFormVal, buildBannerParams, BannerForm, buildPromoParams } from './BannerForm';

export function PriceButton(
  props: {
    price: Price;
  }
) {
  return (
    <div className="d-grid mb-3">
      <button className="btn btn-primary">
        {formatPrice(props.price)}
      </button>
    </div>
  );
}

export function DisplayPaywall(
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

  const { live } = useLiveState();
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
        setErr(err.message);
      });
  }

  return (
    <>
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Default Banner</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShow(true)}>Edit</button>
        </div>

        <div className="card-body">
          <BannerBox banner={props.banner} />
        </div>
      </div>
      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
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

function PromoCard(
  props: {
    passport: CMSPassport;
    promo: Promo;
  }
) {

  const isEmpty = props.promo.id === '';

  const { live } = useLiveState();
  const [ show, setShow ] = useState(false);
  const [ err, setErr ] = useState('');
  const [ paywallDoc, setPaywallDoc] = useState<PaywallDoc>();

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
        setErr(err.message);
      });
  }

  return (
    <>
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Promotion Banner</span>

          <div className="btn-group">
            { !isEmpty && <button className="btn btn-danger btn-sm">Drop</button>}
            <button className="btn btn-primary btn-sm" onClick={() => setShow(true)}>New</button>
          </div>
        </div>

        <div className="card-body">
          { isEmpty && <p>Not promotion set.</p>}
          { !isEmpty && <BannerBox banner={props.promo} />}
          { props.promo.terms && <TextList text={props.promo.terms} />}
        </div>

        <div className="card-footer">
          Duration: {props.promo.startUtc} to {props.promo.endUtc}
        </div>
      </div>

      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
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

export function ProductCard(
  props: {
    product: PaywallProduct;
  }
) {
  return (
    <div className="card">
      <div className="card-header text-end">
        <Link to={`products/${props.product.id}`}>
          Details
        </Link>
      </div>
      <div className="card-body">
        <h3 className="card-title text-center mb-3 pb-3">
          {props.product.heading}
        </h3>
        {
          props.product.prices.map((p, i) => (
            <PriceButton key={i} price={p} />
          ))
        }
        <TextList text={props.product.description}/>
      </div>
    </div>
  );
}
