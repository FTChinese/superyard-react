export function TableBody(
  props: {
    rows: TRow[];
  }
) {
  return (
    <tbody>
      {
        props.rows.map((row, i) => <TableRow row={row} key={i} />)
      }
    </tbody>
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

export type TRow  = {
  head?: string;
  data: Array<string | JSX.Element>
}
