import { useEffect, useState } from 'react';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { OnProductUpserted } from '../../features/product/callbacks';
import { ProductFormDialog } from '../../features/product/ProductFormDialog';
import { ProductList } from '../../features/product/ProductList';
import { Loading } from '../../components/progress/Loading';
import { useProductList } from '../../features/product/useProductList';

export function ProductListPage() {
  const { live } = useLiveMode();
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <ProductListScreen
      passport={passport}
      live={live}
    />
  );
}

function ProductListScreen(
  props: {
    passport: CMSPassport,
    live: boolean,
  }
) {
  const [showForm, setShowForm] = useState(false);

  const {
    loading,
    products,
    listProducts,
    onProductCreated,
  } = useProductList();

  useEffect(() => {
    listProducts({
      live: props.live,
      token: props.passport.token
    });
  }, [props.live]);

  return (
    <Loading loading={loading}>
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-3">Products</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            New
          </button>
        </div>

        <ProductList
          products={products}
        />

        <ProductFormDialog
          passport={props.passport}
          live={props.live}
          show={showForm}
          onHide={() => setShowForm(false)}
          onUpserted={onProductCreated}
        />
      </div>
    </Loading>
  );
}


