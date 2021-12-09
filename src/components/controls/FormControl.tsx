export function FormControl(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {

  let className = 'form-control';

  if (props.className) {
    className += ` ${className}`;
  }

  return (
    <input
      {...props}
      className={className}
    />
  );
}

export function FormLabel(
  props: {
    htmlFor: string;
    children: string | JSX.Element;
  }
) {
  return (
    <label
      className="form-label"
      htmlFor={props.htmlFor}
    >
      {props.children}
    </label>
  );
}

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
