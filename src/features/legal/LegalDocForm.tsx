import { FormikHelpers, Formik, Form } from 'formik';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';
import { Textarea } from '../../components/controls/Textarea';
import { TextInput } from '../../components/controls/TextInput';
import { invalidMessages } from '../../data/form-value';
import { LegalDoc, LegalDocParams } from '../../data/legal';
import * as Yup from 'yup';
import { useState } from 'react';
import { createLegalDoc, updateLegalDoc } from '../../repository/legal-doc';
import { CMSPassport } from '../../data/cms-account';
import { ResponseError } from '../../repository/response-error';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { SupportMarkdown } from '../../components/text/SupportMarkdown';
import { ArrowRight } from '../../components/graphics/icons';

export type LegalFormVal = {
  title: string;
  summary: string;
  body: string;
}

export function newLegalDocParams(val: LegalFormVal, by: string): LegalDocParams {
  return {
    title: val.title,
    summary: val.summary,
    author: by,
    body: val.body,
  };
}

export function LegalDocForm(
  props: {
    onSubmit: (
      values: LegalFormVal,
      formikHelpers: FormikHelpers<LegalFormVal>
    ) => void | Promise<any>;
    doc?: LegalDoc;
  }
) {
  return (
    <Formik<LegalFormVal>
      initialValues={{
        title: props.doc?.title || '',
        summary: props.doc?.summary || '',
        body: props.doc?.body || '',
      }}
      validationSchema={Yup.object({
        title: Yup.string().required(invalidMessages.required),
        body: Yup.string().required(invalidMessages.required)
      })}
      onSubmit={props.onSubmit}
    >
      <Form>
        <FullscreenTwoCols
          right={
            <Textarea
              label="Body *"
              name="body"
              rows={50}
            />
          }
        >
          <>
            <TextInput
              label="Title *"
              name="title"
              type="text"
            />
            <Textarea
              label="Summary"
              name="summary"
              rows={2}
              desc="optional"
            />


            <FormikSubmitButton
              text="Save"
            />

            <div className="mt-3 text-end">
              <SupportMarkdown />
              <ArrowRight />
            </div>
          </>
        </FullscreenTwoCols>
      </Form>
    </Formik>
  );
}

export function useLegalDocForm() {
  const [ error, setError ] = useState('');
  const [ docUpserted, setDocUpserted ] = useState<LegalDoc>();

  function onCreateDoc(
    values: LegalFormVal,
    helpers: FormikHelpers<LegalFormVal>,
    passport: CMSPassport,
  ) {
    helpers.setSubmitting(true);
    setError('');

    const params = newLegalDocParams(values, passport.userName);

    createLegalDoc(
        params,
        passport.token,
      )
      .then(doc => {
        helpers.setSubmitting(false);
        setDocUpserted(doc);
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        if (err.invalid) {
          helpers.setErrors(err.toFormFields);
          return;
        }

        setError(err.message);
      });
  }

  function onUpdateDoc(
    helpers: FormikHelpers<LegalFormVal>,
    args: {
      docId: string;
      formValues: LegalFormVal;
      token: string;
    },
  ) {
    helpers.setSubmitting(true);
    setError('');

    // Not author field won't be changed on server side.
    const params = newLegalDocParams(
      args.formValues,
      ''
    );

    updateLegalDoc(
        args.docId,
        params,
        args.token,
      )
      .then(doc => {
        helpers.setSubmitting(false);
        setDocUpserted(doc);
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        if (err.invalid) {
          helpers.setErrors(err.toFormFields);
          return;
        }

        setError(err.message);
      });
  }

  return {
    error,
    docUpserted,
    onCreateDoc,
    onUpdateDoc,
  };
}
