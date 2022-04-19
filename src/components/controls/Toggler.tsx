import { ChangeEvent } from 'react';

export function Toggler(
  props: {
    name: string;
    label: string;
    checked: boolean;
    onToggle: (checked: boolean) => void;
  }
) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onToggle(e.target.checked);
  }

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        checked={props.checked}
        id={props.name}
        onChange={handleChange}
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
