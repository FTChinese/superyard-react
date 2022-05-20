import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Release, ReleaseParams } from '../../data/android';
import { ReleaseForm } from './ReleaseForm';
import { FormikHelpers } from 'formik';

export function ReleaseEditScreen(
  props: {
    release: Release;
    onSubmit: (
      values: ReleaseParams,
      formikHelpers: FormikHelpers<ReleaseParams>
    ) => void | Promise<any>;
  }
) {
  return (
    <Row className="justify-content-center">
      <Col md={10} lg={8}>
        <h2>Edit {props.release.versionName}</h2>

        <ReleaseForm
          onSubmit={props.onSubmit}
          release={props.release}
        />
      </Col>
    </Row>
  );
}
