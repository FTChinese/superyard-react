import { useField } from 'formik';
import { FormText } from './FormText';
import { TextInputProps } from './TextInputProps';

export function Textarea(
  props: Omit<TextInputProps, 'type'> &{
    rows?: number,
  },
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
      <textarea
        className={`form-control${isInvalid ? ' is-invalid' : ''}`}
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        disabled={props.disabled === true}
        rows={props.rows}
      />
      {
        props.desc ? (
          <FormText>{props.desc}</FormText>
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
