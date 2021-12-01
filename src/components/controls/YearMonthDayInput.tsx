import { FormText } from './FormText';
import { TextInput } from './TextInput';

export function YearMonthDayInput(
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
      <div className="row row-cols-3">
        <TextInput
          label="Years"
          name={`${props.namePrefix}.years`}
          type="number"
          disabled={props.disabled}
          wrapperClass="col"
        />
        <TextInput
          label="Months"
          name={`${props.namePrefix}.months`}
          type="number"
          disabled={props.disabled}
          wrapperClass="col"
        />
        <TextInput
          label="Days"
          name={`${props.namePrefix}.days`}
          type="number"
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
  )
}
