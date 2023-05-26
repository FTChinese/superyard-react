import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { PriceFormDialog } from '../../features/ftcprice/PriceFormDialog';
import { ProductDetails } from '../../features/product/ProductDetails';
import { Price, newFtcPriceParts } from '../../data/ftc-price';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Loading } from '../../components/progress/Loading';
import { TRow, Table, TableBody, TableHead } from '../../components/list/Table';
import { sitemap } from '../../data/sitemap';
import { Link } from 'react-router-dom';
import { concatPriceParts, localizeActive } from '../../data/localization';
import { readableYMD } from '../../data/ymd';
import { ErrorText } from '../../components/text/ErrorText';
import { CMSPassport } from '../../data/cms-account';
import { useProduct } from '../../features/product/useProduct';
import { ProductFormDialog } from '../../features/product/ProductFormDialog';

export function ProductDetailPage() {
  const { productId } = useParams<'productId'>();
  const { passport } = useAuth();
  const { live } = useLiveMode();

  if (!productId) {
    return <ErrorText message="Product id missing in url!" />;
  }

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <>
      <ProductPageScreen
        productId={productId}
        passport={passport}
        live={live}
      />
    </>
  );
}

function ProductPageScreen(
  props: {
    productId: string;
    passport: CMSPassport;
    live: boolean;
  }
) {

  // Show create new price dialog.
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const {
    product,
    loadingProduct,
    loadProduct,
    setProduct,

    activating,
    activateProduct,

    loadingPrice,
    priceList,
    loadPrices,

    onPriceCreated,
  } = useProduct();

  useEffect(() => {
    loadProduct(props.productId, {
      live: props.live,
      token: props.passport.token,
    });
  }, [props.live]);

  useEffect(() => {
    loadPrices(props.productId, {
      live: props.live,
      token: props.passport.token,
    })
  }, [props.live]);

  return (
    <>
      <section className="mb-3">
        <h4>Product Details</h4>
        <Loading loading={loadingProduct}>
          <>
            {
              product && (
                <ProductDetails
                  product={product}
                  onEdit={() => {
                    setShowProductForm(true)
                  }}
                  onActivate={() => {
                    activateProduct(product.id, {
                      live: props.live,
                      token: props.passport.token,
                    });
                  }}
                  activating={activating}
                />
              )
            }
          </>
        </Loading>
      </section>

      <section>
        <h4 className="d-flex justify-content-between">
          <span>Price List</span>
          {
            product && (
              <Button
                onClick={() => setShowPriceForm(true)}
              >
                New Price
              </Button>
            )
          }
        </h4>

        <Loading loading={loadingPrice}>
          <Table
            head={
              <TableHead
                cols={['ID', 'Price', 'Active', 'Kind', 'Cycle', 'Start', 'End']}
              />
            }
          >
            <TableBody
              rows={priceList.map(buildPriceRow)}
            />
          </Table>
        </Loading>

      </section>

      {
        product &&
        <ProductFormDialog
          passport={props.passport}
          live={props.live}
          show={showProductForm}
          onHide={() => setShowProductForm(false)}
          onUpserted={setProduct}
          product={product}
        />
      }

      {
        product &&
        <PriceFormDialog
          passport={props.passport}
          live={props.live}
          show={showPriceForm}
          onHide={() => setShowPriceForm(false)}
          onUpserted={(p) => {
            setShowPriceForm(false)
            onPriceCreated(p)
          }}
          product={product}
        />
      }
    </>
  );
}

function buildPriceRow(p: Price): TRow {
  return {
    key: p.id,
    data: [
      <Link to={sitemap.ftcPriceOf(p.id
      )}>{p.id}</Link>,
      concatPriceParts(newFtcPriceParts(p)),
      localizeActive(p.active),
      p.kind,
      readableYMD(p.periodCount),
      p.startUtc || 'NULL',
      p.endUtc || 'NULL',
    ]
  };
}
