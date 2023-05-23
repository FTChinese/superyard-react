import Spinner from 'react-bootstrap/Spinner';

interface LoadingState {
  error: string;
  progress: boolean;
}

export function loadingStarted(): LoadingState {
  return {
    error: '',
    progress: true,
  };
}

export function loadingStopped(): LoadingState {
  return {
    error: '',
    progress: false,
  };
}

export function loadingErrored(msg: string): LoadingState {
  return {
    error: msg,
    progress: false,
  }
}


/**
 * @deprecated Use Loading
 */
export function ProgressOrError(
  props: {
    state: LoadingState;
    children: JSX.Element;
  }
) {
  if (props.state.progress) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner
          as="span"
          animation="border"
        />
      </div>
    );
  }

  if (props.state.error) {
    return (
      <div className="text-danger text-center">
        Error: {props.state.error}
      </div>
    );
  }

  return props.children;
}
