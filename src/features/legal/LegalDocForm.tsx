import { FormikHelpers, Formik, Form } from 'formik';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';
import { Textarea } from '../../components/controls/Textarea';
import { TextInput } from '../../components/controls/TextInput';
import { invalidMessages } from '../../data/form-value';
import { LegalDoc, LegalDocParams } from '../../data/legal';
import * as Yup from 'yup';
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


