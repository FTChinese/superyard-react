import { Form, Formik, FormikHelpers } from 'formik';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import { Cycle, cycleOpts, PriceKind, priceKindOpts, Tier, tierOpts } from '../../data/enum';
import { NewPriceParams, UpdatePriceParams, Price } from '../../data/price';
import { invalidMessages } from '../../data/form-value';
import { Dropdown } from '../../components/controls/Dropdown';
import { TextInput } from '../../components/controls/TextInput';
import ProgressButton from '../../components/buttons/ProgressButton';
import { InputGroup } from '../../components/controls/InputGroup';
import Button from 'react-bootstrap/Button';
import { loadStripePrice } from '../../repository/paywall';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { liveModeState } from '../../store/recoil-state';
import { useAuthContext } from '../../store/AuthContext';
import { ResponseError } from '../../repository/response-error';
import { StripeRawPrice } from '../../data/paywall';
import { YearMonthDayInput } from '../../components/controls/YearMonthDayInput';
import { concatDateTime, DateTime, YearMonthDay } from '../../data/period';
import { DateTimeInput } from '../../components/controls/DateTimeInput';
import { TimezoneBadge } from './Badge';

export type PriceFormVal = {
  cycle: Cycle;
  description?: string;
  kind: PriceKind;
  nickname?: string;
  periodCount: YearMonthDay;
  stripePriceId: string;
  start: DateTime;
  end: DateTime;
  unitAmount: number;
};

export function buildNewPriceParams(
  v: PriceFormVal,
  meta: {
    productId: string,
    tier: Tier,
    offset: string,
  }
): NewPriceParams {
  const isRecurring = v.kind === 'recurring';

  return {
    tier: meta.tier,
    cycle: isRecurring ? v.cycle : undefined,
    description: v.description || undefined,
    kind: v.kind,
    nickname: v.nickname || undefined,
    periodCount: v.periodCount,
    productId: meta.productId,
    stripePriceId: v.stripePriceId,
    startUtc: isRecurring
      ? undefined
      : (concatDateTime(v.start, meta.offset) || undefined),
    endUtc: isRecurring
      ? undefined
      : (concatDateTime(v.end, meta.offset) || undefined),
    unitAmount: v.unitAmount,
  };
}

export function buildUpdatePriceParams(v: PriceFormVal): UpdatePriceParams {
  return {
    stripePriceId: v.stripePriceId,
    nickname: v.nickname || undefined,
    description: v.description || undefined,
  }
}

export function PriceForm(
  props: {
    onSubmit: (
      values: PriceFormVal,
      formikHelpers: FormikHelpers<PriceFormVal>
    ) => void | Promise<any>;
    onStripePrice: (price: StripeRawPrice) => void;
    errMsg: string;
    // Passed either from product when creating a price,
    // of existing price when updating.
    tier: Tier;
    price?: Price;
  }
) {
  const { passport } = useAuthContext();
  const live = useRecoilValue(liveModeState);
  const [ errMsg, setErrMsg ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const isUpdate = !!props.price;

  useEffect(() => {
    setErrMsg(props.errMsg);
  }, [props.errMsg]);

  const handleLoadStripe = (id: string) => {
    if (!passport) {
      toast.error('No credentials!');
      return;
    }

    if (!id) {
      toast.error('You must provide a stripe price id to preview');
      return;
    }

    setLoading(true);

    loadStripePrice(
        id,
        { live, token: passport.token }
      )
      .then(rawPrice => {
        setLoading(false);
        props.onStripePrice(rawPrice);
      })
      .catch((err: ResponseError) => {
        setLoading(false);
        toast.error(err.message);
      });
  }

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
      <Formik<PriceFormVal>
        initialValues={{
          cycle: props.price?.cycle || ('' as Cycle),
          description: props.price?.description || '',
          kind: '' as PriceKind,
          nickname: props.price?.nickname || '',
          periodCount: {
            years: 0,
            months: 0,
            days: 0,
          },
          stripePriceId: props.price?.stripePriceId || '',
          start: {
            date: '',
            time: '00:00:00',
          },
          end: {
            date: '',
            time: '00:00:00',
          },
          unitAmount: props.price?.unitAmount || 0,
        }}
        validationSchema={Yup.object({
          kind: Yup.string()
            .required(invalidMessages.required),
          cycle: Yup.string()
            .when('kind', {
              is: 'recurring',
              then: Yup.string().required(invalidMessages.required)
            }),
          periodCount: Yup.object({
            years: Yup.number().test('periodCount', 'One of period count is required', function() {
              return this.parent.years || this.parent.months || this.parent.days;
            }),
            months: Yup.number().test('periodCount', 'One of period count is required', function() {
              return this.parent.years || this.parent.months || this.parent.days;
            }),
            days: Yup.number().test('periodCount', 'One of period count is required', function() {
              return this.parent.years || this.parent.months || this.parent.days;
            }),
          }),
          unitAmount: Yup.number()
            .min(0, 'Price cannot be less than 0')
            .required(),
          stripePriceId: Yup.string()
            .trim()
            .required(invalidMessages.required)
        })}
        onSubmit={props.onSubmit}
      >
        { formik => (
          <Form>
            <Dropdown
              label="Kind *"
              name="kind"
              opts={priceKindOpts}
              disabled={isUpdate}
              desc="Only one time price could be used as introductory"
            />
            {
              (formik.values.kind === 'recurring') &&
              <Dropdown
                name="cycle"
                label="Cycle *"
                opts={cycleOpts}
                disabled={isUpdate}
                desc="Billiing interval. Only required when kind is recurring"
              />
            }
            <TextInput
              label="Price Unit Amount *"
              name="unitAmount"
              type="number"
              disabled={isUpdate}
            />
            <InputGroup
              controlId="stripePriceId"
              type="text"
              label="Stripe Price ID *"
              desc="The Stripe price id matching this price. Click Inspect to view the the price details."
              suffix={
                <Button
                  variant="primary"
                  onClick={() => handleLoadStripe(formik.values.stripePriceId)}
                  disabled={loading || (!formik.values.stripePriceId)}
                >
                  { loading ? 'Loading' : 'Inspect' }
                </Button>
              }
            />
            <YearMonthDayInput
              title="Period Count *"
              namePrefix="periodCount"
              disabled={isUpdate}
              desc="How many years, months, or days user will get for this price. At least one of them should be provided."
            />
            <TextInput
              label="Description"
              name="description"
              type="text"
              desc="Optional short descriptive text that might be present to user"
            />
            <TextInput
              label="Nickname"
              name="nickname"
              type="text"
              desc="In case you need to recall why this price is created"
            />
            {
              (formik.values.kind === 'one_time') &&
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
                <TimezoneBadge/>
              </>
            }
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
