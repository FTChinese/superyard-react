import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { FtcPriceFormDialog } from '../../features/ftcprice/FtcPriceDialog';
import { ProductDetails } from '../../features/product/ProductDetails';
import { Price, newFtcPriceParts } from '../../data/ftc-price';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { TRow, Table, TableBody, TableHead } from '../../components/list/Table';
import { sitemap } from '../../data/sitemap';
import { Link } from 'react-router-dom';
import { concatPriceParts, localizeActive } from '../../data/localization';
import { readableYMD } from '../../data/ymd';
import { ErrorText } from '../../components/text/ErrorText';
import { CMSPassport } from '../../data/cms-account';
import { useProduct } from '../../features/product/useProduct';
import { ProductUpsertDialog } from '../../features/product/ProductUpsertDialog';
import { ProductStatusDialog } from '../../features/product/ProductStatusDialog';
import { ReqConfig } from '../../http/ReqConfig';
import { PriceForm } from '../../features/ftcprice/FtcPriceForm';
import { useUpsertFtcPrice } from '../../features/ftcprice/useUpsertFtcPrice';

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

  const config: ReqConfig = {
    live: props.live,
    token: props.passport.token,
  };

  // Show create new price dialog.
  const [showNewPrice, setShowNewPrice] = useState(false);
  // Show product editing dialog.
  const [showEditProduct, setShowEditProductF] = useState(false);
  // Show activate/deactivate dialog.
  const [showProductStatus, setShowProductStatus] = useState(false);

  const {
    product,
    priceList,
    initLoading,

    onProductUpdated,
    onPriceCreated,
  } = useProduct();

  const {
    createPrice,
  } = useUpsertFtcPrice();

  useEffect(() => {
    initLoading(props.productId, config);
  }, [props.live]);

  return (
    <>
      <section className="mb-3">
        <h4>Product Details</h4>
        {
          product &&
          <>
            <ProductDetails
              product={product}
              onEdit={() => {
                setShowEditProductF(true)
              }}
              onActivate={() => {
                setShowProductStatus(true);
              }}
            />

            <ProductUpsertDialog
              passport={props.passport}
              live={props.live}
              show={showEditProduct}
              onHide={() => setShowEditProductF(false)}
              onUpserted={(p) => {
                setShowEditProductF(false);
                onProductUpdated(p);
              }}
              product={product}
            />
            <ProductStatusDialog
              config={config}
              product={product}
              show={showProductStatus}
              onHide={() => {
                setShowProductStatus(false);
              }}
              onSaved={(p) => {
                onProductUpdated(p);
                setShowProductStatus(false);
              }}
            />
          </>
        }
      </section>

      <section>
        <h4 className="d-flex justify-content-between">
          <span>Price List</span>
          {
            product && (
              <Button
                onClick={() => setShowNewPrice(true)}
              >
                New Price
              </Button>
            )
          }
        </h4>

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

      </section>

      {
        product &&
        <FtcPriceFormDialog
          show={showNewPrice}
          onHide={() => setShowNewPrice(false)}
          live={props.live}
          form={
            <PriceForm
              onSubmit={
                createPrice(
                  product,
                  config,
                  (p) => {
                    onPriceCreated(p);
                    setShowNewPrice(false);
                  },
                )
              }
            />
          }
          isCreate={true}
          tier={product.tier}
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
