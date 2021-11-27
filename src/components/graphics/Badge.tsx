export function Badge(
  props: {
    theme: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
    text: string;
    className?: string;
  }
) {

  let v = `badge bg-${props.theme}`;

  if (props.className) {
    v += props.className;
  }

  return (
    <span className={v}>{props.text}</span>
  )
}
