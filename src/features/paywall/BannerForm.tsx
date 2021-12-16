import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import { BannerParams, PromoParams } from '../../data/paywall';
import { invalidMessages } from '../../data/form-value';
import ProgressButton from '../../components/buttons/ProgressButton';
import { TextInput } from '../../components/controls/TextInput';
import { DateTimeInput } from "../../components/controls/DateTimeInput";
import { Textarea } from '../../components/controls/Textarea';
import { isoOffset } from '../../utils/time-formatter';
import { SupportMarkdown } from '../../components/SupportMarkdown';
import { DateTime, dateTimeToISO } from '../../data/date-time';

export type BannerFormVal = BannerParams & {
  start: DateTime;
  end: DateTime;
};

export function buildBannerParams(v: BannerFormVal): BannerParams {
  return {
    heading: v.heading,
    subHeading: v.subHeading || undefined,
    coverUrl: v.coverUrl || undefined,
    content: v.content || undefined,
    terms: v.terms || undefined,
  };
}

export function buildPromoParams(v: BannerFormVal): PromoParams {
  const offset = isoOffset(new Date());

  return {
    ...buildBannerParams(v),
    startUtc: dateTimeToISO(v.start, offset),
    endUtc: dateTimeToISO(v.end, offset),
  };
}

export function BannerForm(
  props: {
    onSubmit: (
      values: BannerFormVal,
      formikHelpers: FormikHelpers<BannerFormVal>
    ) => void | Promise<any>;
    initial?: BannerParams;
    errMsg: string;
    hasPeriod?: boolean;
  }
) {
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg(props.errMsg);
  }, [props.errMsg]);

  let schema = Yup.object({
    heading: Yup.string()
      .required(invalidMessages.required)
  });

  if (props.hasPeriod) {
    schema = Yup.object({
      heading: Yup.string()
        .required(invalidMessages.required),
      start: Yup.object({
        date: Yup.string().required(invalidMessages.required),
        time: Yup.string().required(invalidMessages.required),
      }),
      end: Yup.object({
        date: Yup.string().required(invalidMessages.required),
        time: Yup.string().required(invalidMessages.required),
      }),
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
      <Formik<BannerFormVal>
        initialValues={{
          heading: props.initial?.heading || '',
          subHeading: props.initial?.subHeading || '',
          coverUrl: props.initial?.coverUrl || '',
          content: props.initial?.content || '',
          terms: props.initial?.terms || '',
          start: {
            date: '',
            time: '00:00:00',
          },
          end: {
            date: '',
            time: '00:00:00',
          }
        }}
        validationSchema={schema}
        onSubmit={props.onSubmit}
      >
        { formik => (
          <Form>
            <TextInput
              label="Heading *"
              name="heading"
              type="text"
            />
            <TextInput
              label="Secondary Heading"
              name="subHeading"
              type="text"
            />
            <TextInput
              label="Cover URL"
              name="coverUrl"
              type="url"
            />
            <Textarea
              label="Content"
              name="content"
              rows={8}
              desc={<SupportMarkdown />}
            />
            <DateTimeInput
              title="Start Date Time"
              namePrefix="start"
              disabled={!props.hasPeriod}
            />
            <DateTimeInput
              title="End Date Time"
              namePrefix="end"
              disabled={!props.hasPeriod}
            />
            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text="Save"
              isSubmitting={formik.isSubmitting}/>
          </Form>
        )}
      </Formik>
    </>
  );
}
