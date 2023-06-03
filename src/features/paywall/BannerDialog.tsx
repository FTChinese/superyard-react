import Modal from 'react-bootstrap/Modal';
import { ModeBadge } from '../../components/text/Badge';
import { ReqConfig } from '../../http/ReqConfig';
import { Banner, PaywallDoc, Promo } from '../../data/paywall';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { BannerForm } from './BannerForm';
import { useBanner } from './useBanner';
import { JSONBlock } from '../../components/text/JSONBlock';
import { ConfirmDialog } from '../../components/dialog/ConfirmDialog';

export function BannerDialog(
  props: {
    config: ReqConfig;
    show: boolean;
    onHide: () => void;
    banner: Banner;
    onSaved: (pwd: PaywallDoc) => void;
  }
) {

  const title = props.banner.id === '' ? 'Create Banner' : 'Edit Banner';

  const {
    saveBanner,
    paywallDoc,
  } = useBanner();

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          {title}
        </Modal.Title>
        <ModeBadge live={props.config.live} />
      </Modal.Header>
      <Modal.Body>
        <FullscreenTwoCols
          right={<JSONBlock value={paywallDoc} />}
        >
          <BannerForm
            onSubmit={saveBanner(
              props.config,
              props.onSaved,
            )}
            initial={props.banner}
            errMsg={""}
          />
        </FullscreenTwoCols>
      </Modal.Body>
    </Modal>
  );
}

export function NewPromoDialog(
  props: {
    config: ReqConfig;
    show: boolean;
    onHide: () => void;
    promo: Promo;
    onSaved: (pwd: PaywallDoc) => void;
  }
) {

  const {
    createPromo,
    paywallDoc,
  } = useBanner();

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          Create Promotion Banner
        </Modal.Title>
        <ModeBadge live={props.config.live} />
      </Modal.Header>

      <Modal.Body>
        <FullscreenTwoCols
          right={<JSONBlock value={paywallDoc} />}
        >
          <BannerForm
            onSubmit={createPromo(
              props.config,
              props.onSaved,
            )}
            initial={props.promo}
            errMsg={""}
            hasPeriod={true}
          />
        </FullscreenTwoCols>
      </Modal.Body>
    </Modal>
  )
}

export function DropPromoDialog(
  props: {
    config: ReqConfig,
    show: boolean,
    onHide: () => void,
    onSaved: (pwd: PaywallDoc) => void,
  }
) {
  const {
    dropping,
    dropPromo,
  } = useBanner();

  return (
    <ConfirmDialog
      show={props.show}
      onHide={props.onHide}
      title='Delete current promo?'
      body='Are you sure you want to delete this promo?'
      live={props.config.live}
      onConfirm={() => {
        dropPromo(
          props.config,
          props.onSaved,
        );
      }}
      progress={dropping}
    />
  )
}
