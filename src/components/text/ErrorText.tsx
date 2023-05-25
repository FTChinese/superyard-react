export function ErrorText(
  props: {
    message: string
  }
) {
  return (
    <div className="text-danger">
      {props.message}
    </div>
  );
}
