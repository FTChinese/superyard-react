import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function ContentLayout() {

  return (
    <div className="container-fluid">
      <div className="row">

        <div className="col-sm-2" role="navigation">
          <Sidebar />
        </div>

        <div className="col-sm-10">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}

export function SingleCenterCol(
  props: {
    children: JSX.Element
  }
) {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        { props.children }
      </div>
    </div>
  );
}
