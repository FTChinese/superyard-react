import { useEffect, useState } from 'react';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { loadingErrored, ProgressOrError, loadingStarted, loadingStopped } from '../../components/progress/ProgressOrError';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { OnProductUpserted } from '../../features/paywall/callbacks';
import { ProductFormDialog } from '../../features/paywall/ProductFormDialog';
import { ProductList } from '../../features/paywall/ProductList';
import { listProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';

export function ProductListPage() {

  const { live } = useLiveMode();
  const { passport } = useAuth();

  const [ loading, setLoading ] = useState(loadingStarted());
  const [ products, setProducts ] = useState<Product[]>([]);

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    setLoading(loadingStarted());
    setProducts([]);

    listProduct({ live, token: passport.token})
      .then(products => {
        setLoading(loadingStopped());
        setProducts(products);
      })
      .catch((err: ResponseError) => {
        setLoading(loadingErrored(err.message));
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
    <ProgressOrError state={loading}>
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
    </ProgressOrError>
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
