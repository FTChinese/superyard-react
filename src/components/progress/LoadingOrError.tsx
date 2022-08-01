import Spinner from 'react-bootstrap/Spinner';

export function LoadingOrError(
  props: {
    loading?: boolean;
    error?: string;
  }
) {
  if (props.loading) {
    <div className="d-flex justify-content-center align-items-center">
      <Spinner
        as="span"
        animation="border"
      />
    </div>
  }

  if (props.error) {
    return (
      <div className="text-danger text-center">
        Error: {props.error}
      </div>
    );
  }

  return null;
}
