import { ChangeEvent } from 'react';

export function Switch(
  props: {
    key: string;
    label: string;
    checked: boolean;
    onToggle: (checkd: boolean) => void;
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
        id={props.key}
        onChange={handleChange}
      />
      <label
        className="form-check-label"
        htmlFor={props.key}
      >
        {props.label}
      </label>
    </div>
  );
}
