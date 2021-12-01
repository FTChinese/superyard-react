/**
 * @description Display a line-separated string in a unordered list.
 */
export function TextList(
  props: {
    text: string;
  }
) {
  return (
    <ul>
      {
        props.text.split('\n').map((line, index) => (
          <li key={index}>{line}</li>
        ))
      }
    </ul>
  );
}

/**
 * @description Display an array of string in unordered list.
 */
export function ListLines(
  props: {
    lines: string[];
  }
) {
  return (
    <ul>
      {
        props.lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))
      }
    </ul>
  );
}
