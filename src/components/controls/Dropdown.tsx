import { useField } from 'formik';
import { SelectOption } from '../../data/enum';

export function Dropdown(
  props: {
    name: string;
    label: string;
    opts: SelectOption<string>[];
    desc?: string
    disabled?: boolean;
  }
) {

  const [ field, meta ] = useField(props.name);

  const isInvalid = meta.touched && meta.error;

  return (
    <div className="mb-3">
      <label
        className="form-label"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <select
        className={`form-select${isInvalid ? ' is-invalid' : ''}`}
        id={props.name}
        name={props.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        disabled={props.disabled === true}
      >
        <DropdownItem
          name="Please select..."
          value=""
        />
        {
          props.opts.map((opt, i) => (
            <DropdownItem
              key={i}
              name={opt.name}
              value={opt.value}
              disabled={opt.disabled}
            />
          ))
        }
      </select>
      {
        props.desc && (
          <small className="form-text text-muted">{props.desc}</small>
        )
      }
      {
        isInvalid && (
          <div className="invalid-feedback">{meta.error}</div>
        )
      }
    </div>
  );
}

function DropdownItem(
  props: {
    name: string;
    value: string;
    disabled?: boolean;
  },
) {
  return (
    <option
      value={props.value}
      disabled={props.disabled}
    >
      {props.name}
    </option>
  );
}
