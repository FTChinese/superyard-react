import { FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { ModeBadge } from '../../features/paywall/Badge';
import { convertProductForm, CreateProductFormVal, ProductForm } from '../../features/paywall/ProductForm';
import { ProductList } from '../../features/paywall/ProductList';
import { createProduct, listProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { useAuthContext } from '../../store/AuthContext';
import { useLiveState } from '../../store/useLiveState';

export function ProductListPage() {
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);

  const { live } = useLiveState();
  const { passport } = useAuthContext();

  const [ products, setProducts ] = useState<Product[]>([]);

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    listProduct({ live, token: passport.token})
      .then(products => {
        setLoading(false);
        setProducts(products);
      })
      .catch((err: ResponseError) => {
        setLoading(false);
        setErr(err.message)
      });
  }, [live]);

  const handleActivate = (product: Product) => {

    setProducts(products.map(p => {
      if (p.id === product.id) {
        return product;
      }
      if (p.tier === product.tier && p.active) {
        return {
          ...p,
          active: false,
        }
      }

      return p;
    }));
  };

  const handleCreate = (product: Product) => {
    setProducts([product, ...products]);
  };

  return (
    <ErrorBoudary errMsg={err}>
      <LoadingSpinner loading={loading}>
        <div>
          <PageHead
            passport={passport}
            onCreated={handleCreate}
          />
          <ProductList
            products={products}
            passport={passport}
            onActivated={handleActivate}
          />
        </div>
      </LoadingSpinner>
    </ErrorBoudary>
  );
}

function PageHead(
  props: {
    passport: CMSPassport;
    onCreated: (product: Product) => void;
  }
) {

  const { live } = useLiveState();
  const [ show, setShow ] = useState(false);
  const [ err, setErr ] = useState('');

  const handleSubmit = (
    values: CreateProductFormVal,
    helpers: FormikHelpers<CreateProductFormVal>
  ) => {
    helpers.setSubmitting(true);
    setErr('');

    const params = convertProductForm(values, props.passport.userName);

    createProduct(
        params,
        { live, token: props.passport.token }
      )
      .then(prod => {
        helpers.setSubmitting(false);
        console.log(prod);
        props.onCreated(prod);
        setShow(false);
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        setErr(err.message);
      });
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-3">Products</h2>
        <button className="btn btn-primary" onClick={() => setShow(true) }>New</button>
      </div>
      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="me-3">Create Product</Modal.Title>
          <ModeBadge live={live} />
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <ProductForm
                  onSubmit={handleSubmit}
                  errMsg={err}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
