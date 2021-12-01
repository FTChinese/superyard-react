import { FormText } from './FormText';
import { TextInput } from './TextInput';


export function DateTimeInput(
  props: {
    title: string;
    namePrefix: string;
    disabled?: boolean;
    desc?: string;
  }
) {
  return (
    <fieldset className="mb-3">
      <legend>{props.title}</legend>
      <div className="row row-cols-2">
        <TextInput
          label="Date"
          name={`${props.namePrefix}.date`}
          type="date"
          disabled={props.disabled}
          wrapperClass="col"
        />
        <TextInput
          label="Time"
          name={`${props.namePrefix}.time`}
          type="time"
          disabled={props.disabled}
          wrapperClass="col"
        />
      </div>
      {
        props.desc &&
        <FormText>
          {props.desc}
        </FormText>
      }
    </fieldset>
  );
}
