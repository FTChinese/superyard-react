import { SmallButton } from '../../components/buttons/Button';
import { BottomBorderBox, PrimaryLine, SecondaryLine } from '../../components/list/TwoLineRow';
import { BorderHeader } from '../../components/text/BorderHeader';
import { isOneOff, isZeroMember } from '../../data/membership';
import { ReaderAccount } from '../../data/reader-account';

export function MemberMenu(
  props: {
    jwtToken: string;
    reader: ReaderAccount;
    onClickUpsert: () => void;
  }
) {

  return (
    <div className='mt-4'>
      <BorderHeader
        text='Membership Settings'
        level={5}
      />

      {
        isZeroMember(props.reader.membership) &&
        <RowCreateOneOff
          onClick={props.onClickUpsert}
        />
      }

      {
        isOneOff(props.reader.membership) &&
        <RowUpdateOneOff
          onClick={props.onClickUpsert}
        />
      }
    </div>
  )
}

function RowCreateOneOff(
  props: {
    onClick: () => void;
  }
) {
  return (
    <BottomBorderBox>
      <>
        <PrimaryLine
          text='Create membership of one-off purchase'
          trailIcon={
            <SmallButton
              onClick={props.onClick}
            >
              Create
            </SmallButton>
          }
        />
        <SecondaryLine text='Membership with payment method of Alipay or Wechat pay' />
      </>
    </BottomBorderBox>
  )
}

function RowUpdateOneOff(
  props: {
    onClick: () => void;
  }
) {
  return (
    <BottomBorderBox>
      <>
        <PrimaryLine
          text='Modify membership of one-off purchase'
          trailIcon={
            <SmallButton
              onClick={props.onClick}
            >
              Modify
            </SmallButton>
          }
        />
        <SecondaryLine text='Direct modification limitied only to membership with payment method of Alipay or Wechat pay' />
      </>
    </BottomBorderBox>
  )
}



