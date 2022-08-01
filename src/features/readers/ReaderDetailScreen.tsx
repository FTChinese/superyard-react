import { CMSPassport } from '../../data/cms-account';
import { ReaderAccount } from '../../data/reader-account';
import { AccountDetails } from './AccountDetails';
import { MemberDetails } from './MemberDetails';
import { MemberMenu } from './MemberMenu';

export function ReaderDetailScreen(
  props: {
    passport: CMSPassport;
    reader: ReaderAccount;
    onDropMember: () => void;
    onClickUpsert: () => void;
  }) {
  return (
    <>
      <section>
        <AccountDetails
          reader={props.reader}
        />
      </section>

      <section>
        <MemberDetails
          jwtToken={props.passport.token}
          reader={props.reader}
          onClickDrop={props.onDropMember}
        />
      </section>

      <section>
        <MemberMenu
          jwtToken={props.passport.token}
          reader={props.reader}
          onClickUpsert={props.onClickUpsert}
        />
      </section>
    </>
  );
}
