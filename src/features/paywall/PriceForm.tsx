import { Form, Formik, FormikHelpers } from 'formik';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import { Cycle, cycleOpts, Tier, tierOpts } from '../../data/enum';
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
import { YearMonthDay } from '../../data/period';

export type PriceFormVal = {
  tier: Tier;
  cycle: Cycle;
  periodCount: YearMonthDay;
  unitAmount: number;
  stripePriceId: string;
  description?: string;
  nickname?: string;
};

export function buildNewPriceParams(
  v: PriceFormVal,
  meta: {
    productId: string,
    createdBy: string,
  }
): NewPriceParams {
  return {
    ...meta,
    unitAmount: v.unitAmount,
    tier: v.tier,
    cycle: v.cycle,
    stripePriceId: v.stripePriceId,
    nickname: v.nickname || undefined,
    description: v.description || undefined,
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
          tier: props.tier,
          cycle: props.price?.cycle || ('' as Cycle),
          periodCount: {
            years: 0,
            months: 0,
            days: 0,
          },
          unitAmount: props.price?.unitAmount || 0,
          stripePriceId: props.price?.stripePriceId || '',
          description: props.price?.description || '',
          nickname: props.price?.nickname || ''
        }}
        validationSchema={Yup.object({
          tier: Yup.string()
            .required(invalidMessages.required),
          cycle: Yup.string()
            .required(invalidMessages.required),
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
              name="tier"
              label="Tier *"
              opts={tierOpts}
              disabled={true}
            />
            <Dropdown
              name="cycle"
              label="Cycle *"
              opts={cycleOpts}
              disabled={isUpdate}
            />
            <YearMonthDayInput
              title="Period Count *"
              namePrefix="periodCount"
              disabled={isUpdate}
              desc="How many years, months, or days user will get for this price"
            />
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
            <TextInput
              label="Description"
              name="description"
              type="text"
            />
            <TextInput
              label="Nickname"
              name="nickname"
              type="text"
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
