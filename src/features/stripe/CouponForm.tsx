import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { DateTimeInput } from '../../components/controls/DateTimeInput';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';
import { TextInput } from '../../components/controls/TextInput';
import { TimezoneBadge } from '../../components/text/Badge';
import { concatDateTimePartsISO, DateTimeParts, defaultDateTimeParts } from '../../data/datetime-parts';
import { invalidMessages } from '../../data/form-value';
import { CouponParams } from '../../data/stripe-price';
import { currentZone } from '../../utils/time-format';

export type CouponFormVal = {
  couponId: string;
  start: DateTimeParts;
  end: DateTimeParts;
};

export function buildCouponParams(priceId: string, v: CouponFormVal): CouponParams {
  const zone = currentZone();

  return {
    priceId: priceId,
    startUtc: concatDateTimePartsISO(v.start, zone),
    endUtc: concatDateTimePartsISO(v.end, zone),
  }
}

export function CouponForm(
  props: {
    onSubmit: (
      values: CouponFormVal,
      formikHelpers: FormikHelpers<CouponFormVal>
    ) => void | Promise<any>;
  }
) {
  return (
    <Formik<CouponFormVal>
      initialValues={{
        couponId: '',
        start: defaultDateTimeParts(),
        end: defaultDateTimeParts(),
      }}
      validationSchema={Yup.object({
        couponId: Yup.string()
          .trim()
          .required(invalidMessages.required)
      })}
      onSubmit={props.onSubmit}
    >
      <Form>
        <TextInput
          label="Coupon ID"
          name="couponId"
          type="text"
          desc="Copy & Paste a coupon id from Stripe dashboard"
        />
        <DateTimeInput
          title="Promotion Start"
          namePrefix="start"
        />
        <DateTimeInput
          title="Promotion End"
          namePrefix="end"
        />
        <TimezoneBadge/>

        <FormikSubmitButton
          text="Save"
          wrapped="block"
        />
      </Form>
    </Formik>
  );
}
