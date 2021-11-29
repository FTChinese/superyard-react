export function FormText(
  props: {
    children: string | JSX.Element
  }
) {
  return (
    <small className="form-text text-muted">
      {props.children}
    </small>
  )
}
