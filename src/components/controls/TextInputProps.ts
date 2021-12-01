export interface TextInputProps {
  name: string;
  type: 'email' | 'password' | 'text' | 'url' | 'number' | 'date' | 'time';
  label?: string;
  placeholder?: string;
  desc?: string | JSX.Element;
  disabled?: boolean;
  wrapperClass?: string;
}
