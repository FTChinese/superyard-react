export function LoadingOrErr(
  props: {
    loading?: boolean;
    error?: string;
  }
) {
  if (props.loading) {
    <div className="d-flex justify-content-center align-items-center">
      Loading...
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
