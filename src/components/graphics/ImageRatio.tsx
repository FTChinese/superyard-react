export function ImageRatio(
  props: {
    src?: string;
  }
) {
  return (
    <div className="box-16-9">
      {
        props.src ?
        <img src={props.src} /> :
        <span>No image provided</span>
      }
    </div>
  )
}
