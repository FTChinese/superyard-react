export function Unauthorized() {
  return (
    <div className="text-danger">
      Login required!
    </div>
  );
}

export function Missing(
  props: {
    message: string
  }
) {
  return (
    <div className="text-danger">
      Warning: {props.message}
    </div>
  );
}
