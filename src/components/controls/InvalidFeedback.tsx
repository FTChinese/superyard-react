export function InvalidFeedback(
  props: {
    children?: string;
  }
) {
  return (
    <div className="invalid-feedback">{props.children}</div>
  );
}
