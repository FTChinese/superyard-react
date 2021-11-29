import { useField } from 'formik';
import { TextInputProps } from './TextInputProps';

export function TextInput(
  props: TextInputProps,
) {
  const [ field, meta ] = useField(props);

  const isInvalid = meta.touched && meta.error;

  return (
    <div className="mb-3">
      { props.label &&
        <label
          className="form-label"
          htmlFor={props.name}
        >
          {props.label}
        </label>
      }
      <input
        className={`form-control${isInvalid ? ' is-invalid' : ''}`}
        id={props.name}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        disabled={props.disabled === true}
      />
      {
        props.desc ? (
          <small className="form-text text-muted">{props.desc}</small>
        ) : null
      }
      {
        isInvalid ? (
          <div className="invalid-feedback">{meta.error}</div>
        ) : null
      }
    </div>
  );
}

export function DateTimeInput(
  props: {
    title: string;
    namePrefix: string;
    disabled?: boolean;
  }
) {
  return (
    <fieldset>
      <legend>{props.title}</legend>
      <div className="row">
        <div className="col-12 col-sm-6">
          <TextInput
            label="Date"
            name={`${props.namePrefix}.date`}
            type="date"
            disabled={props.disabled}
          />
        </div>
        <div className="col-12 col-sm-6">
          <TextInput
            label="Time"
            name={`${props.namePrefix}.time`}
            type="time"
            disabled={props.disabled}
          />
        </div>
      </div>
    </fieldset>
  )
}
