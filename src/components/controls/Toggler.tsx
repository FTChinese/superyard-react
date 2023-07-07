export function Toggler(
  props: {
    name: string;
    label: string;
    checked: boolean;
    onClick: () => void;
  }
) {

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        checked={props.checked}
        id={props.name}
        onChange={props.onClick}
      />
      <label
        className="form-check-label"
        htmlFor={props.name}
      >
        {props.label}
      </label>
    </div>
  );
}
