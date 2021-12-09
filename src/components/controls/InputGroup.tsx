import { useField } from 'formik';
import { FormControl, FormLabel, FormText } from './FormControl';
import { InvalidFeedback } from './InvalidFeedback';
import { TextInputType } from './TextInputProps';

export function InputGroupText(
  props: {
    children: string | JSX.Element;
  }
) {
  return (
    <span className="input-group-text">
      {props.children}
    </span>
  );
}

export function InputGroup(
  props: {
    controlId: string;
    type: TextInputType;
    label?: string;
    prefix?: JSX.Element;
    suffix?: JSX.Element;
    placeholder?: string;
    disabled?: boolean;
    desc?: string | JSX.Element;
  }
) {

  const [ field, meta ] = useField(props.controlId);

  const isInvalid = meta.touched && meta.error;

  return (
    <div className="mb-3">
      {
        props.label &&
        <FormLabel
          htmlFor={props.controlId}
        >
          {props.label}
        </FormLabel>
      }
      <div className="input-group">
        { props.prefix }
        <FormControl
          id={props.controlId}
          type={props.type}
          name={props.controlId}
          placeholder={props.placeholder}
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          disabled={props.disabled}
        />
        { props.suffix }
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


