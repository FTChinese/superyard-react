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
