import { useField } from 'formik';
import { FormText } from './FormText';
import { InvalidFeedback } from './InvalidFeedback';

export function Switch(
  props: {
    label: string;
    name: string;
    checked: boolean;
    desc?: string;
    disabled?: boolean;
  }
) {

  const [ field, meta ] = useField(props);

  const isInvalid = meta.touched && meta.error;

  return (
    <div className="mb-3">
      <div className="form-check form-switch">
        <input
          className={`form-check-input${isInvalid ? ' is-invalid' : ''}`}
          id={props.name}
          type="checkbox"
          checked={props.checked}
          onChange={field.onChange}
          onBlur={field.onBlur}
          disabled={props.disabled}
        />
        <label
          className="form-check-label"
          htmlFor={props.name}
        >
          {props.label}
        </label>
      </div>
      {
        props.desc &&
        <FormText>
          {props.desc}
        </FormText>
      }
      {
        isInvalid &&
        <InvalidFeedback>
          {meta.error}
        </InvalidFeedback>
      }
    </div>
  );
}
