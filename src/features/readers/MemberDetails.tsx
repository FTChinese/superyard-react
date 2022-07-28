import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import { Table, TableBody, TRow } from '../../components/list/Table';
import { isZeroMember, Membership } from '../../data/membership';
import { SmallButton } from '../../components/buttons/Button';
import { getCompoundId, ReaderAccount } from '../../data/reader-account';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { LoadButton } from '../../components/buttons/Button';
import { useMemberState } from './useMemberState';
import { toast } from 'react-toastify';

export function MemberDetails(
  props: {
    jwtToken: string;
    reader: ReaderAccount;
    onDropped: () => void;
  }
) {
  const rows = buildMemberRows(props.reader.membership);
  const [showDrop, setShowDrop] = useState(false);

  return (
    <>
      <Card>
        <Card.Header>
          <Stack direction='horizontal'>
            <span>Membership Details</span>
            {
              !isZeroMember(props.reader.membership) &&
              <SmallButton
                onClick={() => setShowDrop(true)}
                className="ms-auto"
                variant="danger"
              >
                Drop
              </SmallButton>
            }
          </Stack>
        </Card.Header>

        <Table>
          <TableBody
            rows={rows}
          />
        </Table>
      </Card>

      <DropMemberDialog
        token={props.jwtToken}
        compoundId={getCompoundId(props.reader)}
        show={showDrop}
        onHide={() => setShowDrop(false)}
        onDropped={props.onDropped}
      />
    </>
  );
}

function buildMemberRows(m: Membership): TRow[] {
  return [
    {
      head: 'Tier',
      data: [m.tier || 'N/A']
    },
    {
      head: 'Cycle',
      data: [m.cycle || 'N/A']
    },
    {
      head: 'Expiration Date',
      data: [m.expireDate || 'N/A']
    },
    {
      head: 'Payment Method',
      data: [m.payMethod || 'N/A']
    },
    {
      head: 'FTC Price ID',
      data: [m.ftcId || 'N/A']
    },
    {
      head: 'Stripe Subscripiton ID',
      data: [m.stripeSubsId || 'N/A']
    },
    {
      head: 'Stripe Auto Renewal',
      data: [`${m.autoRenew}`]
    },
    {
      head: 'Stripe Subscription Status',
      data: [m.status || 'N/A']
    },
    {
      head: 'Apple Original Transaction ID',
      data: [m.appleSubsId || 'N/A']
    },
    {
      head: 'B2B Licence ID',
      data: [m.b2bLicenceId || 'N/A']
    },
    {
      head: 'Standard Addon',
      data: [`${m.standardAddOn}`]
    },
    {
      head: 'Premium Addon',
      data: [`${m.premiumAddOn}`]
    },
    {
      head: 'Is VIP',
      data: [`${m.vip}`]
    }
  ];
}

function DropMemberDialog(
  props: {
    token: string;
    compoundId: string;
    show: boolean;
    onHide: () => void;
    onDropped: () => void;
  }
) {
  const {
    progress,
    errMsg,
    dropMember,
  } = useMemberState();

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg])
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        Delete Membership
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this user's membership?</p>
      </Modal.Body>

      <Modal.Footer>
        <LoadButton
          text='Delete'
          progress={progress}
          onClick={() => {
            dropMember(props.token, props.compoundId)
              .then(ok => {
                if (ok) {
                  props.onDropped();
                }
              })
          }}
        />
      </Modal.Footer>
    </Modal>
  );
}
