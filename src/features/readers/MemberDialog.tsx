import { FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { FullscreenDialog } from '../../components/layout/FullscreenDialog';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { SelectOption } from '../../data/enum';
import { isZeroMember, MemberParams, Membership } from '../../data/membership';
import { getCompoundId, ReaderAccount } from '../../data/reader-account';
import { ResponseError } from '../../http/response-error';
import { createOneOffMember, updateOneOffMember } from '../../repository/reader';
import { MemberForm } from './MemberForm';

/**
 * @description MemberDialog is used to show a popup to create/update membership.
 */
export function MemberDialog(
  props: {
    jwtToken: string;
    priceList: SelectOption<string>[];
    reader: ReaderAccount;
    show: boolean;
    onHide: () => void;
    onUpserted: (m: Membership) => void;
  }
) {

  const onSubmit = (
    values: MemberParams,
    helpers: FormikHelpers<MemberParams>
  ) => {
    helpers.setSubmitting(true);

    if (isZeroMember(props.reader.membership)) {
      createOneOffMember(props.jwtToken, {
        ftcId: props.reader.id,
        unionId: props.reader.unionId,
        ...values
      })
        .then(m => props.onUpserted(m))
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
      return;
    }

    updateOneOffMember(
      props.jwtToken,
      getCompoundId(props.reader),
      values
    )
      .then(m => props.onUpserted(m))
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
