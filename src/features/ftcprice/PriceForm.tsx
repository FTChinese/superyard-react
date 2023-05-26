import { Form, Formik, FormikHelpers } from 'formik';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import {
  Cycle,
  cycleOpts,
  PriceKind,
  priceKindOpts,
  Tier,
} from '../../data/enum';
import { NewPriceParams, UpdatePriceParams, Price } from '../../data/ftc-price';
import { invalidMessages } from '../../data/form-value';
import { Dropdown } from '../../components/controls/Dropdown';
import { TextInput } from '../../components/controls/TextInput';
import { YearMonthDayInput } from '../../components/controls/YearMonthDayInput';
import { isZeroYMD, ymdZero, YearMonthDay } from '../../data/ymd';
import { DateTimeInput } from '../../components/controls/DateTimeInput';
import { TimezoneGuide } from '../../components/text/Badge';
import {
  DateTimeParts,
  parseISOToParts,
  defaultDateTimeParts,
  joinDateTimeParts,
} from '../../data/datetime-parts';
import { StripePrice } from '../../data/stripe-price';
import { currentZone } from '../../utils/time-format';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';

export type PriceFormVal = {
  cycle: Cycle;
  title?: string;
  kind: PriceKind;
  nickname?: string;
  periodCount: YearMonthDay;
  start: DateTimeParts;
  end: DateTimeParts;
  unitAmount: number;
};

export function buildNewPriceParams(
  v: PriceFormVal,
  meta: {
    productId: string;
    tier: Tier;
  }
): NewPriceParams {
  const isRecurring = (v.kind === 'recurring');

  return {
    tier: meta.tier,
    cycle: isRecurring ? v.cycle : undefined,
    title: v.title || undefined,
    kind: v.kind,
    nickname: v.nickname || undefined,
    periodCount: v.periodCount,
    productId: meta.productId,
    startUtc: isRecurring ? undefined : joinDateTimeParts(v.start) || undefined,
    endUtc: isRecurring ? undefined : joinDateTimeParts(v.end) || undefined,
    unitAmount: v.unitAmount,
  };
}

export function buildUpdatePriceParams(v: PriceFormVal): UpdatePriceParams {
  return {
    nickname: v.nickname || undefined,
    periodCount: v.periodCount,
    title: v.title || undefined,
  };
}

export function PriceForm(props: {
  onSubmit: (
    values: PriceFormVal,
    formikHelpers: FormikHelpers<PriceFormVal>
  ) => void | Promise<any>;
  onStripePrice: (price: StripePrice) => void;
  errMsg: string;
  // Passed either from product when creating a price,
  // of existing price when updating.
  tier: Tier;
  price?: Price;
}) {
  const zone = currentZone();
  const [errMsg, setErrMsg] = useState('');

  const isUpdate = !!props.price;
  const isPeriodSet = props.price ? !isZeroYMD(props.price.periodCount) : false;

  useEffect(() => {
    setErrMsg(props.errMsg);
  }, [props.errMsg]);


  return (
    <>
      {errMsg && (
        <Alert variant="danger" dismissible onClose={() => setErrMsg('')}>
          {errMsg}
        </Alert>
      )}
      <Formik<PriceFormVal>
        initialValues={{
          cycle: props.price?.cycle || ('' as Cycle),
          title: props.price?.title || '',
          kind: props.price?.kind || ('' as PriceKind),
          nickname: props.price?.nickname || '',
          periodCount: props.price?.periodCount || ymdZero(),
          start: props.price?.startUtc
            ? parseISOToParts(props.price.startUtc)
            : defaultDateTimeParts(zone),
          end: props.price?.endUtc
            ? parseISOToParts(props.price.endUtc)
            : defaultDateTimeParts(zone),
          unitAmount: props.price?.unitAmount || 0,
        }}
        validationSchema={Yup.object({
          kind: Yup.string().required(invalidMessages.required),
          cycle: Yup.string().when('kind', {
            is: 'recurring',
            then: (schema) => schema.required(invalidMessages.required),
          }),
          periodCount: Yup.object({
            years: Yup.number().test(
              'periodCount',
              'One of period count is required',
              function () {
                return (
                  this.parent.years || this.parent.months || this.parent.days
                );
              }
            ),
            months: Yup.number().test(
              'periodCount',
              'One of period count is required',
              function () {
                return (
                  this.parent.years || this.parent.months || this.parent.days
                );
              }
            ),
            days: Yup.number().test(
              'periodCount',
              'One of period count is required',
              function () {
                return (
                  this.parent.years || this.parent.months || this.parent.days
                );
              }
            ),
          }),
          unitAmount: Yup.number()
            .min(0, 'Price cannot be less than 0')
            .required(),
          stripePriceId: Yup.string().trim().required(invalidMessages.required),
        })}
        onSubmit={props.onSubmit}
      >
        {(formik) => (
          <Form>
            <Dropdown
              label="Kind *"
              name="kind"
              opts={priceKindOpts}
              disabled={isUpdate}
              desc="Only one time price could be used as introductory"
            />
            {formik.values.kind === 'recurring' && (
              <Dropdown
                name="cycle"
                label="Cycle *"
                opts={cycleOpts}
                disabled={isUpdate}
                desc="Billiing interval. Only required when kind is recurring"
              />
            )}
            <TextInput
              label="Price Unit Amount *"
              name="unitAmount"
              type="number"
              disabled={isUpdate}
            />
            <YearMonthDayInput
              title="Period Count *"
              namePrefix="periodCount"
              disabled={isPeriodSet}
              desc="How many years, months, or days user will get for this price. At least one of them should be provided."
            />
            <TextInput
              label="Title"
              name="title"
              type="text"
              desc="Optional short descriptive text that might be present to user"
            />
            <TextInput
              label="Nickname"
              name="nickname"
              type="text"
              desc="Optional. For your own reference."
            />
            {formik.values.kind === 'one_time' && (
              <>
                <DateTimeInput
                  title="Start Date Time"
                  namePrefix="start"
                  desc="Optional for one time price"
                  disabled={isUpdate}
                />
                <DateTimeInput
                  title="End Date Time"
                  namePrefix="end"
                  desc="Optional for one time price"
                  disabled={isUpdate}
                />
                <TimezoneGuide />
              </>
            )}

            <FormikSubmitButton text="Save" />
          </Form>
        )}
      </Formik>
    </>
  );
}
