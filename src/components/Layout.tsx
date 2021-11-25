import { Sidebar } from './layout/Sidebar';

export function CenterLayout(
  props: {
    children: JSX.Element
  }
) {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export function ContentLayout(
  props: {
    children: JSX.Element,
  }
) {

  return (
    <div className="container-fluid">
      <div className="row">

        <div className="col-sm-2" role="navigation">
          <Sidebar />
        </div>

        <div className="col-sm-10">
          {props.children}
        </div>
      </div>
    </div>
  );
}
