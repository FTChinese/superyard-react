import Button from 'react-bootstrap/Button';
import { PagingQuery } from '../http/paged-list';

export type OnNavigatePage = (params: PagingQuery) => void;

export function Pagination(
  props: {
    totalItem: number;
    currentPage: number;
    itemsPerPage: number;
    onNavigate: OnNavigatePage;
  }
) {
  const totalPages = Math.ceil(props.totalItem/props.itemsPerPage);

  return (
    <div className="d-flex justify-content-between">
      <Button
        variant="link"
        onClick={() => {
          props.onNavigate({
            page: props.currentPage > 1
              ? props.currentPage - 1
              : 1,
              itemsCount: props.itemsPerPage,
          })
        }}
        disabled={props.currentPage <= 1}
      >
        Previous
      </Button>
      <span>
        {props.currentPage}/{totalPages}
      </span>
      <Button
        variant="link"
        disabled={props.currentPage >= totalPages}
        onClick={() => {
          props.onNavigate({
            page: props.currentPage < totalPages
              ? props.currentPage + 1
              : totalPages,
              itemsCount: props.itemsPerPage,
          })
        }}
      >
        Next
      </Button>
    </div>
  )
}
