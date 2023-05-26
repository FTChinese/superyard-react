import { Form, Formik, FormikHelpers } from 'formik';
import { DateTimeParts, defaultDateTimeParts, joinDateTimeParts, parseISOToParts } from '../../data/datetime-parts';
import { Tier, tierOpts } from '../../data/enum';
import { StripePrice, StripePriceParams } from '../../data/stripe-price';
import { YearMonthDay, ymdZero } from '../../data/ymd';
import * as Yup from 'yup';
import { Dropdown } from '../../components/controls/Dropdown';
import { YearMonthDayInput } from '../../components/controls/YearMonthDayInput';
import { DateTimeInput } from '../../components/controls/DateTimeInput';
import { TimezoneGuide } from '../../components/text/Badge';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';
import { currentZone } from '../../utils/time-format';

export type StripePriceFormVal = {
  tier: Tier;
  periodCount: YearMonthDay;
  start: DateTimeParts;
  end: DateTimeParts;
};

export function buildStripePriceParams(v: StripePriceFormVal, p: StripePrice): StripePriceParams {
  const intro = p.kind === 'one_time';

  return {
    introductory: intro,
    tier: v.tier,
    periodCount: intro ? v.periodCount : undefined,
    startUtc: intro ? joinDateTimeParts(v.start) : undefined,
    endUtc: intro ? joinDateTimeParts(v.end) : undefined,
  }
}

export function StripePriceForm(
  props: {
    onSubmit: (
      values: StripePriceFormVal,
      formikHelpers: FormikHelpers<StripePriceFormVal>
    ) => void | Promise<any>;
    price: StripePrice;
  }
) {
  const zone = currentZone();
  const isIntro = props.price.kind === 'one_time';

  return (
    <>
      <h5 className="text-center">Filling in required metadata here</h5>
      <Formik<StripePriceFormVal>
        initialValues={{
          tier: props.price.tier || ('' as Tier),
          periodCount: props.price.periodCount || ymdZero(),
          start: props.price.startUtc
            ? parseISOToParts(props.price.startUtc)
            : defaultDateTimeParts(zone),
          end: props.price.endUtc
            ? parseISOToParts(props.price.endUtc)
            : defaultDateTimeParts(zone),
        }}
        validationSchema={Yup.object({

        })}
        onSubmit={props.onSubmit}
      >
        {(formik) => (
          <Form>
            <Dropdown
              label="Tier *"
              name="tier"
              opts={tierOpts}
              desc="A required field so that we could deduce to which group of products it belongs"
            />
            {
              isIntro && (
                <>
                  <YearMonthDayInput
                    title="Period Count"
                    namePrefix="periodCount"
                    desc="Duration for introductory price"
                  />
                  <DateTimeInput
                    title="Start Date Time"
                    namePrefix="start"
                    desc="Introductory price  campaign start time"
                  />
                  <DateTimeInput
                    title="End Date Time"
                    namePrefix="end"
                    desc="Introductory price  campaign start time"
                  />
                  <TimezoneGuide />
                </>
              )
            }

            <FormikSubmitButton text="Save"/>
          </Form>
        )}
      </Formik>
    </>
  );
}
