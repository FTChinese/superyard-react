import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { Release, ReleaseParams } from '../../data/android';
import * as Yup from 'yup';
import { invalidMessages } from '../../data/form-value';
import { TextInput } from '../../components/controls/TextInput';
import { Textarea } from '../../components/controls/Textarea';
import { FormikSubmitButton } from '../../components/controls/FormikSubmitButton';
import { SupportMarkdown } from '../../components/text/SupportMarkdown';
import { useEffect } from 'react';

export function ReleaseForm(
  props: {
    onSubmit: (
      values: ReleaseParams,
      formikHelpers: FormikHelpers<ReleaseParams>
    ) => void | Promise<any>;
    release?: Release;
  },
) {
  return (
    <Formik<ReleaseParams>
      initialValues={{
        versionName: props.release?.versionName || '',
        versionCode: props.release?.versionCode || 0,
        body: props.release?.body,
        apkUrl: props.release?.apkUrl || '',
      }}
      validationSchema={Yup.object({
        versionName: Yup.string()
          .required(invalidMessages.required),
        versionCode: Yup.number()
          .min(1)
          .required(invalidMessages.required),
        apkUrl: Yup.string()
          .required(invalidMessages.required)
          .url('Must be an url')
      })}
      onSubmit={props.onSubmit}
    >
      <Form>
        <TextInput
          label="Version Name *"
          name="versionName"
          type="text"
          readOnly={!!props.release}
        />

        <TextInput
          label="Version Code *"
          name="versionCode"
          type="number"
          readOnly={!!props.release}
        />

        <Textarea
          label="Release Log (optional)"
          name="body"
          rows={5}
          desc={<SupportMarkdown />}
        />

        <UrlField />

        <FormikSubmitButton
          text="Save"
        />
      </Form>
    </Formik>
  );
}

function UrlField() {
  const {
    values: { versionName },
    touched,
    setFieldValue,
  } = useFormikContext<ReleaseParams>();

  useEffect(() => {
    if (versionName.trim() !== '' && touched.versionName) {
      setFieldValue('apkUrl', buildApkUrl(versionName));
    }
  }, [versionName, touched.versionName]);

  return (
    <TextInput
      label="APK URL *"
      name="apkUrl"
      type="url"
    />
  );
}

function buildApkUrl(version: string): string {
  return `https://creatives.ftacademy.cn/minio/android/ftchinese-${version}-ftc-release.apk`;
}
