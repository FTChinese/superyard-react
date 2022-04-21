import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { DateTimeInput } from '../../components/controls/DateTimeInput';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';
import { TextInput } from '../../components/controls/TextInput';
import { TimezoneGuide } from '../../components/text/Badge';
import { DateTimeParts, defaultDateTimeParts, joinDateTimeParts } from '../../data/datetime-parts';
import { invalidMessages } from '../../data/form-value';
import { CouponParams } from '../../data/stripe-price';
import { currentZone } from '../../utils/time-format';

export type CouponFormVal = {
  couponId: string;
  start: DateTimeParts;
  end: DateTimeParts;
};

export function buildCouponParams(priceId: string, v: CouponFormVal): CouponParams {

  return {
    priceId: priceId,
    startUtc: joinDateTimeParts(v.start),
    endUtc: joinDateTimeParts(v.end),
  };
}

export function CouponForm(
  props: {
    onSubmit: (
      values: CouponFormVal,
      formikHelpers: FormikHelpers<CouponFormVal>
    ) => void | Promise<any>;
  }
) {

  const zone = currentZone();

  return (
    <Formik<CouponFormVal>
      initialValues={{
        couponId: '',
        start: defaultDateTimeParts(zone),
        end: defaultDateTimeParts(zone),
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
        <TimezoneGuide/>

        <FormikSubmitButton
          text="Save"
          wrapped="block"
        />
      </Form>
    </Formik>
  );
}
