import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { usePaywall } from '../../components/hooks/usePaywall';
import { LoadingOrError } from '../../components/progress/LoadingOrError';
import { CMSPassport } from '../../data/cms-account';
import { zeroMember } from '../../data/membership';
import { buildPriceOptions } from '../../data/paywall';
import { getCompoundId } from '../../data/reader-account';
import { DropMemberDialog } from '../../features/readers/DropMemberDialog';
import { MemberDialog } from '../../features/readers/MemberDialog';
import { ReaderDetailScreen } from '../../features/readers/ReaderDetailScreen';
import { useReaderState } from '../../features/readers/useReaderState';

export function ReaderDetailPageScreen(
  props: {
    ftcId: string;
    passport: CMSPassport;
  }
) {

  const [showDrop, setShowDrop] = useState(false);
  const [showOneOff, setShowOneOff] = useState(false);

  const {
    pwErr,
    paywall,
    loadPaywallIfEmpty,
  } = usePaywall();

  const {
    errMsg,
    progress,
    readerAccount,
    loadReader,
    onMemberModified,
  } = useReaderState();

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  useEffect(() => {
    if (pwErr) {
      toast.error(pwErr)
    }
  }, [pwErr]);

  useEffect(() => {
    loadReader(props.passport.token, props.ftcId);

    loadPaywallIfEmpty(props.passport.token, true);
  }, []);

  if (progress || errMsg) {
    return <LoadingOrError
      loading={progress}
      error={errMsg}
    />;
  }

  if (!readerAccount) {
    return null;
  }

  const priceList = paywall
    ? buildPriceOptions(paywall.products)
    : [];

  return (
    <>
      <ReaderDetailScreen
        passport={props.passport}
        reader={readerAccount}
        onDropMember={() => setShowDrop(true)}
        onClickUpsert={() => setShowOneOff(true)}
      />

      <MemberDialog
        jwtToken={props.passport.token}
        priceList={priceList}
        reader={readerAccount}
        show={showOneOff}
        onHide={() => setShowOneOff(false)}
        onUpserted={onMemberModified}
      />

      <DropMemberDialog
        token={props.passport.token}
        compoundId={getCompoundId(readerAccount)}
        show={showDrop}
        onHide={() => setShowDrop(false)}
        onDropped={() => {
          onMemberModified(zeroMember());
        }}
      />
    </>
  );
}
