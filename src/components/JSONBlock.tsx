export function JSONBlock<T>(
  props: {
    value: T,
  }
) {
  return (
    <pre>
      <code>{JSON.stringify(props.value, undefined, 4)}</code>
    </pre>
  );
}
