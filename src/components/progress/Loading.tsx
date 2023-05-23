import Spinner from 'react-bootstrap/Spinner';

/**
 * Display loading spinner or error message.
 * @param props
 * @returns
 */
export function Loading(
  props: {
    loading: boolean;
    children?: JSX.Element;
    text?: string; // The message displayed alongside loading spinner.
    error?: string;
  }
) {
  if (props.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner
          as="span"
          animation="border"
        />
        {
          props.text &&
          <span className="ms-2">
            {props.text}
          </span>
        }
      </div>
    );
  }

  if (props.error) {
    <div className="text-danger text-center">
      Error: {props.error}
    </div>
  }

  return props.children ? props.children : null;
}
