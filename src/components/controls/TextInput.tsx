import { useField } from 'formik';
import { FormText } from './FormControl';
import { InvalidFeedback } from './InvalidFeedback';
import { TextInputProps } from './TextInputProps';

export function TextInput(
  props: TextInputProps,
) {
  const [ field, meta ] = useField(props);

  const isInvalid = meta.touched && meta.error;

  const wrapperClass = props.wrapperClass
    ? props.wrapperClass
    : 'mb-3';

  return (
    <div className={wrapperClass}>
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
        readOnly={props.readOnly}
      />
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


