import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { usePaywall } from '../../components/hooks/usePaywall';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { loadPaywall } from '../../repository/paywall';
import { ResponseError } from '../../http/response-error';
import { ModeBadge } from '../../components/text/Badge';
import { JSONBlock } from '../../components/text/JSONBlock';
import { LoadButton } from '../../components/buttons/Button';

export function RebuildButton() {
  const { live } = useLiveMode();
  const { paywall, setPaywall } = usePaywall();
  const { passport } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  const handleRebuild = () => {
    if (!passport) {
      toast.error('No credentials found!');
      return;
    }

    setSubmitting(true);

    console.log('Start rebuiding paywall...');
    loadPaywall({
      live,
      token: passport.token,
      refresh: true,
    })
      .then((result) => {
        setSubmitting(false);
        setPaywall(result);
        setShow(true);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        toast.error(err.message);
      });
  };

  return (
    <>
      <LoadButton
        text="Rebuild Paywall"
        progress={submitting}
        disabled={submitting}
        onClick={handleRebuild}
      />
      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="me-3">Latest Paywall Data</Modal.Title>
          <ModeBadge live={live} />
        </Modal.Header>
        <Modal.Body>
          <JSONBlock value={paywall} />
        </Modal.Body>
      </Modal>
    </>
  );
}
