export interface TextInputProps {
  name: string;
  type: TextInputType;
  label?: string;
  placeholder?: string;
  desc?: string | JSX.Element;
  disabled?: boolean;
  readOnly?: boolean;
  wrapperClass?: string;
}

export type TextInputType = 'email' | 'password' | 'text' | 'url' | 'number' | 'date' | 'time';
