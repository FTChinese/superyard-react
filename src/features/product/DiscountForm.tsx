import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import { OfferKind, offerKindOpts } from '../../data/enum';
import { YearMonthDay } from '../../data/period';
import { DiscountParams } from '../../data/ftc-price';
import { invalidMessages } from '../../data/form-value';
import { TextInput } from '../../components/controls/TextInput';
import { DateTimeInput } from "../../components/controls/DateTimeInput";
import { Dropdown } from '../../components/controls/Dropdown';
import ProgressButton from '../../components/buttons/ProgressButton';
import { Switch } from '../../components/controls/Switch';
import { YearMonthDayInput } from '../../components/controls/YearMonthDayInput';
import { DateTime, dateTimeToISO } from '../../data/date-time';

export type DiscountFormVal = {
  title: string;
  kind: OfferKind;
  priceOff: number;
  recurring: boolean;
  period: YearMonthDay;
  start: DateTime;
  end: DateTime;
};

export function buildDiscountParams(
  v: DiscountFormVal,
  meta: {
    createdBy: string;
    priceId: string;
    offset: string;
  }
): DiscountParams {
  return {
    description: v.title,
    kind: v.kind,
    priceOff: v.priceOff,
    recurring: v.recurring,
    overridePeriod: v.period,
    startUtc: dateTimeToISO(v.start, meta.offset) || undefined,
    endUtc: dateTimeToISO(v.end, meta.offset) || undefined,
    createdBy: meta.createdBy,
    priceId: meta.priceId,
  }
}

export function DiscountForm(
  props: {
    onSubmit: (
      values: DiscountFormVal,
      formikHelpers: FormikHelpers<DiscountFormVal>
    ) => void | Promise<any>;
    errMsg: string;
  }
) {
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg(props.errMsg);
  }, [props.errMsg]);

  return (
    <>
      {
        errMsg &&
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErrMsg('')}>
          {errMsg}
        </Alert>
      }
      <Formik<DiscountFormVal>
        initialValues={{
          title: '',
          kind: '' as OfferKind,
          priceOff: 0,
          recurring: true,
          period: {
            years: 0,
            months: 0,
            days: 0,
          },
          start: {
            date: '',
            time: '00:00:00',
          },
          end: {
            date: '',
            time: '00:00:00',
          }
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .required(invalidMessages.required),
          kind: Yup.string()
            .required(invalidMessages.required),
        })}
        onSubmit={props.onSubmit}
      >
        { formik => (
          <Form>
            <TextInput
              label="Title *"
              name="title"
              type="text"
              placeholder="现在购买享xx折优惠"
            />
            <Dropdown
              label="Target *"
              name="kind"
              opts={offerKindOpts}
            />
            <TextInput
              label="Price Off *"
              name="priceOff"
              type="number"
              desc="Minimum 0"
            />
            <Switch
              label="Recurring during the lifetime of this offer"
              name="recurring"
            />
            <YearMonthDayInput
              title="Purchased period"
              namePrefix="period"
              desc="Leave it alone if you don't mean to override the default 1 year/ 1 month subscription period"
            />
            <DateTimeInput
              title="Start Date Time"
              namePrefix="start"
              desc="Leave untouched for permanent offer"
            />
            <DateTimeInput
              title="End Date Time"
              namePrefix="end"
              desc="Leave untouched for permanent offer"
            />
            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text="Save"
              isSubmitting={formik.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
