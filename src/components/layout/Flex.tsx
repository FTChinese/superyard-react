/**
 * Flex implements bootstrap's d-flex.
 */
export function Flex(
  props: {
    start?: JSX.Element;
    end?: JSX.Element;
    children?: JSX.Element;
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    className?: string;
  }
) {

  const justify = ` justify-content-${props.justify || 'between'}`;
  const align = ` align-items-${props.align || 'center'}`;

  let className = `d-flex${justify}${align}`;
  if (props.className) {
    className += ` ${props.className}`;
  }

  return (
    <div className={className}>
      {props.start}
      {props.children}
      {props.end}
    </div>
  );
}
