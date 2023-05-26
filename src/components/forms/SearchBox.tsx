import { ChangeEvent, FormEventHandler, useState } from 'react';
import { FormControl, FormLabel, FormText } from '../controls/FormControl';
import { SubmitButton } from '../controls/SubmitButton';

export function SearchBox(
  props: {
    controlId: string;
    onSubmit: (v: string) => void;
    progress: boolean;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    desc?: string | JSX.Element
  }
) {

  const [value, setValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.trim());
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    props.onSubmit(value);
  }

  return (
    <form method='POST' onSubmit={handleSubmit}>
      <div className="mb-3">
        {
          props.label &&
          <FormLabel
            htmlFor={props.controlId}
          >
          { props.label }
          </FormLabel>
        }

        <div className="input-group">
          <FormControl
            id={props.controlId}
            type="text"
            name={props.controlId}
            placeholder={props.placeholder}
            onChange={handleChange}
            value={value}
          />
          <SubmitButton
            variant='primary'
            text='Search'
            disabled={props.progress || (value === '')}
            progress={props.progress}
          />
        </div>
        {
          props.desc &&
          <FormText>{props.desc}</FormText>
        }
      </div>
    </form>
  );
}
