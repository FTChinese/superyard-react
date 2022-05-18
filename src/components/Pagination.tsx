import Button from 'react-bootstrap/Button';
import { PagedNavParams } from '../data/paged-list';

export function Pagination(
  props: {
    totalItem: number;
    currentPage: number;
    itemsPerPage: number;
    onNavigate: (params: PagedNavParams) => void;
  }
) {
  const totalPages = Math.ceil(props.totalItem/props.itemsPerPage);

  return (
    <div className="d-flex justify-content-between">
      <Button
        variant="link"
        onClick={() => {
          props.onNavigate({
            prevNext: props.currentPage > 1
              ? props.currentPage - 1
              : 1,
              itemsPerPage: props.itemsPerPage,
          })
        }}
        disabled={props.currentPage === 1}
      >
        Previous
      </Button>
      <span>
        {props.currentPage}/{totalPages}
      </span>
      <Button
        variant="link"
        disabled={props.currentPage === totalPages}
        onClick={() => {
          props.onNavigate({
            prevNext: props.currentPage < totalPages
              ? props.currentPage + 1
              : totalPages,
              itemsPerPage: props.itemsPerPage,
          })
        }}
      >
        Next
      </Button>
    </div>
  )
}
