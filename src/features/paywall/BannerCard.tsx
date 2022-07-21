import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { Card, Button, Modal, ButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ImageRatio } from '../../components/graphics/ImageRatio';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { TextList } from '../../components/list/TextList';
import { ModeBadge } from '../../components/text/Badge';
import { JSONBlock } from '../../components/text/JSONBlock';
import { CMSPassport } from '../../data/cms-account';
import { Banner, PaywallDoc, Promo } from '../../data/paywall';
import { dropPromo, saveBanner, savePromo } from '../../repository/paywall';
import { ResponseError } from '../../http/response-error';
import {
  BannerFormVal,
  buildBannerParams,
  BannerForm,
  buildPromoParams,
} from './BannerForm';

/**
 * @description - BannerBox shows a banner's content shared by default banner and promo banner.
 */
function BannerBox(props: { banner: Banner }) {
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

export function BannerCard(props: { passport: CMSPassport; banner: Banner }) {
  const { live } = useLiveMode();
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [paywallDoc, setPaywallDoc] = useState<PaywallDoc>();

  const modalTitle = props.banner.id === '' ? 'Create Banner' : 'Edit Banner';

  const handleSubmit = (
    values: BannerFormVal,
    helpers: FormikHelpers<BannerFormVal>
  ) => {
    helpers.setSubmitting(true);
    setErr('');
    console.log(values);

    const params = buildBannerParams(values);

    saveBanner(params, { live, token: props.passport.token })
      .then((pwd) => {
        helpers.setSubmitting(false);
        setPaywallDoc(pwd);
        toast.info('Saved! Click Rebuild button to bust cach.');
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

  return (
    <>
      <Card className="card mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Default Banner</span>
          <Button size="sm" onClick={() => setShow(true)}>
            Edit
          </Button>
        </Card.Header>

        <Card.Body className="card-body">
          <BannerBox banner={props.banner} />
        </Card.Body>
      </Card>

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
                {paywallDoc && <JSONBlock value={paywallDoc} />}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export function PromoCard(props: { passport: CMSPassport; promo: Promo }) {
  const isEmpty = props.promo.id === '';

  const { live } = useLiveMode();
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [paywallDoc, setPaywallDoc] = useState<PaywallDoc>();
  const [dropping, setDropping] = useState(false);

  const handleSubmit = (
    values: BannerFormVal,
    helpers: FormikHelpers<BannerFormVal>
  ) => {
    helpers.setSubmitting(true);
    setErr('');
    console.log(values);

    const params = buildPromoParams(values);

    savePromo(params, { live, token: props.passport.token })
      .then((pwd) => {
        helpers.setSubmitting(false);
        setPaywallDoc(pwd);
        toast.info('Saved! Click Rebuild button to bust cach.');
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

    dropPromo({ live, token: props.passport.token })
      .then((pwd) => {
        console.log(pwd);
        setDropping(false);
        toast.success('Dropped. Please rebuild paywall.');
      })
      .catch((err: ResponseError) => {
        setDropping(false);
        toast.error(err.message);
      });
  };

  const hideDialog = () => {
    setPaywallDoc(undefined);
    setShow(false);
  };

  const body =
    props.promo.id === '' ? (
      <p>Not promotion set.</p>
    ) : (
      <>
        <BannerBox banner={props.promo} />

        <Card.Title className="mt-3">Terms and Conditions</Card.Title>
        {props.promo.terms && <TextList text={props.promo.terms} />}

        <Card.Subtitle className="mt-3">Effective</Card.Subtitle>

        <div>
          From {props.promo.startUtc} to {props.promo.endUtc}
        </div>
      </>
    );

  return (
    <>
      <Card className="card mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Promotion Banner</span>

          <ButtonGroup>
            {!isEmpty && (
              <Button variant="danger" size="sm" onClick={handleDrop}>
                {dropping ? 'Processing' : 'Drop'}
              </Button>
            )}
            <Button size="sm" onClick={() => setShow(true)}>
              New
            </Button>
          </ButtonGroup>
        </Card.Header>

        <Card.Body className="card-body">{body}</Card.Body>
      </Card>

      <Modal show={show} fullscreen={true} onHide={hideDialog}>
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
                {paywallDoc && (
                  <pre>
                    <code>{JSON.stringify(paywallDoc, undefined, 4)}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
