import { FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { FullscreenDialog } from '../../components/dialog/FullscreenDialog';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { SelectOption } from '../../data/enum';
import { isZeroMember, MemberFormVal, Membership } from '../../data/membership';
import { ReaderAccount } from '../../data/reader-account';
import { ResponseError } from '../../http/response-error';
import { upsertOneOffMember } from '../../repository/reader';
import { MemberForm } from './MemberForm';

/**
 * @description MemberDialog is used to show a popup to create/update membership.
 */
export function MemberDialog(
  props: {
    jwtToken: string;
    // A list of price extracted from paywall data.
    // When submitting the form, only price id is submitted.
    priceList: SelectOption<string>[];
    reader: ReaderAccount;
    show: boolean;
    onHide: () => void;
    onUpserted: (m: Membership) => void;
  }
) {

  const onSubmit = (
    values: MemberFormVal,
    helpers: FormikHelpers<MemberFormVal>
  ) => {
    helpers.setSubmitting(true);

    upsertOneOffMember(props.jwtToken, {
      ftcId: props.reader.id,
      unionId: props.reader.unionId,
      ...values
    })
      .then(m => {
        props.onUpserted(m);
      })
      .catch((err: ResponseError) => {
        if (err.statusCode == 422) {
          helpers.setErrors(err.toFormFields);
          return;
        }
        toast.error(err.message);
      })
      .finally(() => {
        helpers.setSubmitting(false);
      });

    if (isZeroMember(props.reader.membership)) {

      return;
    }
  }


  const title = isZeroMember(props.reader.membership)
    ? 'New Memership'
    : 'Modify Membership';

  return (
    <FullscreenDialog
      show={props.show}
      onHide={props.onHide}
      title={title}
    >
      <FullscreenSingleCol>
        <MemberForm
          priceOptions={props.priceList}
          current={props.reader.membership}
          onSubmit={onSubmit}
        />
      </FullscreenSingleCol>
    </FullscreenDialog>
  );
}
