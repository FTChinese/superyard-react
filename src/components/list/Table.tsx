export function Table(
  props: {
    children: JSX.Element;
    caption?: string;
    head?: JSX.Element;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    small?: boolean;
    striped?: boolean;
    bordered?: boolean;
    borderless?: boolean;
    verticalAlign?: 'middle' | 'bottom';
  }
) {

  let className = 'table caption-top';

  if (props.small) {
    className += ' table-small';
  }

  if (props.variant) {
    className += ` table-${props.variant}`;
  }

  if (props.striped) {
    className += ' table-striped';
  }

  if (props.bordered) {
    className += ' table-bordered';
  } else if (props.borderless) {
    className += ' table-borderless';
  }

  if (props.verticalAlign) {
    className += ` align-${props.verticalAlign}`;
  }

  return (
    <table className={className}>
      {
        props.caption && <caption>{props.caption}</caption>
      }
      { props.head }
      { props.children }
    </table>
  );
}

export function TableBody(
  props: {
    rows: TRow[];
  }
) {

  return (
    <tbody>
      {
        props.rows.map((row, i) =>
          <TableRow row={row} key={row.key || i} />
        )
      }
    </tbody>
  );
}

export function TableHead(
  props: {
    cols: string[];
  }
) {
  return (
    <thead>
      <tr>
        {
          props.cols.map((s, i) => <th key={i}>{s}</th>)
        }
      </tr>
    </thead>
  );
}

export function TableRow(
  props: {
    row: TRow;
  }
) {
  return (
    <tr>
      { props.row.head && <th>{props.row.head}</th> }
      {
        props.row.data.map((item, i) => <td key={i}>{item}</td>)
      }
    </tr>
  );
}

export type TRow = {
  key?: string;
  head?: string;
  data: Array<string | JSX.Element>
}
