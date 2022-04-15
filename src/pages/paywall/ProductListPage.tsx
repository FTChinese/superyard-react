import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { useAuth } from '../../components/hooks/useAuth';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { OnProductUpserted } from '../../features/paywall/callbacks';
import { ProductFormDialog } from '../../features/paywall/ProductFormDialog';
import { ProductList } from '../../features/paywall/ProductList';
import { listProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { liveModeState } from '../../store/recoil-state';

export function ProductListPage() {

  const live = useRecoilValue(liveModeState);
  const { passport } = useAuth();

  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ products, setProducts ] = useState<Product[]>([]);

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    setErr('');
    setLoading(true);
    setProducts([]);

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
    onCreated: OnProductUpserted;
  }
) {

  const [ show, setShow ] = useState(false);

  const handleCreated = (product: Product) => {
    setShow(false);
    props.onCreated(product)
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-3">Products</h2>
        <button className="btn btn-primary" onClick={() => setShow(true) }>New</button>
      </div>
      <ProductFormDialog
        passport={props.passport}
        show={show}
        onHide={() => setShow(false)}
        onUpserted={handleCreated}
      />
    </>
  );
}
