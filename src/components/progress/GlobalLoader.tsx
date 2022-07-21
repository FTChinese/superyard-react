import { CSSProperties } from 'react';
import { Spinner } from 'react-bootstrap';

export function GlobalLoader(
  props: {
    progress: boolean;
  }
) {


  const style: CSSProperties = {
    position: 'fixed',
    bottom: '50%',
    right: '50%',
    zIndex: 1037,
  }

  if (!props.progress) {
    return null;
  }

  return (
    <div
      style={style}
    >
      <Spinner
        as="span"
        animation="border"
      />
    </div>
  )
}
