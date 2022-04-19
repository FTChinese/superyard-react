import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import ProgressButton from '../../components/buttons/ProgressButton';
import { paywallRebuiltState } from '../../components/hooks/recoil-state';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { RebuiltResult } from '../../data/paywall';
import { rebuildPaywall } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { ModeBadge } from '../../components/text/Badge';
import { JSONBlock } from '../../components/text/JSONBlock';

export function RebuildButton() {

  const { live } = useLiveMode();
  const setPaywall = useSetRecoilState(paywallRebuiltState);
  const { passport } = useAuth();
  const [ submitting, setSubmitting ] = useState(false);
  const [ show, setShow ] = useState(false);
  const [ result, setResult ] = useState<RebuiltResult>();

  const handleRebuild = () => {
    if (!passport) {
      toast.error('No credentials found!')
      return;
    }

    setSubmitting(true);

    console.log('Start rebuiding paywall...');
    rebuildPaywall({ live, token: passport.token })
      .then(result => {
        setSubmitting(false);
        setShow(true);
        setResult(result);
        setPaywall(result.paywall);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        toast.error(err.message);
      });
  };

  return (
    <>
      <ProgressButton
        disabled={submitting}
        text={submitting ? 'Rebuilding...' : 'Rebuild Paywall'}
        isSubmitting={submitting}
        onClick={handleRebuild}
      />
      <Modal
        show={show}
        fullscreen={true}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title className="me-3">
            Latest Paywall Data
          </Modal.Title>
          <ModeBadge live={live} />
        </Modal.Header>
        <Modal.Body>
          <h5>Ftc Products and Prices</h5>
          { result && <JSONBlock value={result.paywall} />}
          <h6>Stripe Prices</h6>
          { result && <JSONBlock value={result.stripePrices} />}
        </Modal.Body>
      </Modal>
    </>
  );
}
