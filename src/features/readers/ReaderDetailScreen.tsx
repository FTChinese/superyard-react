import { CMSPassport } from '../../data/cms-account';
import { Membership, zeroMember } from '../../data/membership';
import { ReaderAccount } from '../../data/reader-account';
import { AccountDetails } from './AccountDetails';
import { MemberDetails } from './MemberDetails';
import { MemberMenu } from './MemberMenu';

export function ReaderDetailScreen(
  props: {
    passport: CMSPassport;
    reader?: ReaderAccount;
    onMemberModified: (m: Membership) => void;
  }) {
  return (
    <>
      {props.reader &&
        <section>
          <AccountDetails
            reader={props.reader} />
        </section>}

      {props.reader &&
        <section>
          <MemberDetails
            jwtToken={props.passport.token}
            reader={props.reader}
            onDropped={() => props.onMemberModified(zeroMember())} />
        </section>}

      {props.reader &&
        <section>
          <MemberMenu
            jwtToken={props.passport.token}
            reader={props.reader}
            onUpserted={props.onMemberModified} />
        </section>}
    </>
  );
}
