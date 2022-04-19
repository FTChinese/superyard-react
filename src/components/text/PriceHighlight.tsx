import { PriceParts } from '../../data/money-parts';

export function PriceHighlight(
  props: {
    parts: PriceParts;
  }
) {
  return (
    <>
      <span>{props.parts.symbol}</span>
      <span className="scale-up2">
        {props.parts.integer}{props.parts.decimal}
      </span>
      <span>{props.parts.cycle}</span>
    </>
  );
}
