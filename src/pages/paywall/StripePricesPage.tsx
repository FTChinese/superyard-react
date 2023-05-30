import { useEffect, useState } from 'react';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { useStripeList } from '../../features/stripe/useStripeList';
import { Loading } from '../../components/progress/Loading';
import Stack from 'react-bootstrap/Stack';
import { Button } from 'react-bootstrap';
import { StripePrice, newStripePriceParts } from '../../data/stripe-price';
import { Table, tableHeaders } from '../../components/list/Table';
import { TableBody } from '../../components/list/Table';
import { TableHead } from '../../components/list/Table';
import { TRow } from '../../components/list/Table';
import { Link, useSearchParams } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { concatPriceParts, localizeActive } from '../../data/localization';
import { readableYMD } from '../../data/ymd';
import { Pagination } from '../../components/Pagination';
import { getPagingQuery, serializePagingQuery } from '../../http/paged-list';
import { StripePricePull } from '../../features/stripe/StripePricePull';

export function StripePricesPage() {
  const { live } = useLiveMode();
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <StripePriceListScreen
      passport={passport}
      live={live}
    />
  )
}

function StripePriceListScreen(
  props: {
    passport: CMSPassport,
    live: boolean,
  }
) {
  const [showForm, setShowForm] = useState(false);

  const {
    loadingList,
    pagedPrices,
    listPrices,
  } = useStripeList();

  const [searchParams, setSearchParams] = useSearchParams();

  const paging = getPagingQuery(searchParams);

  useEffect(() => {
    listPrices(
      {
        live: props.live,
        token: props.passport.token
      },
      paging,
    );

    window.scrollTo(0, 0);
  }, [paging.page, paging.itemsCount]);

  return (
    <>
      <Stack direction="horizontal">
        <h2 className="mb-3">Stripe Prices</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="ms-auto"
        >
          New
        </Button>
      </Stack>

      <Loading loading={loadingList}>
        {
          pagedPrices &&

          <StripePriceTable
            prices={pagedPrices.data}
          />
        }
      </Loading>

      <Pagination
        totalItem={pagedPrices?.total || 0}
        currentPage={pagedPrices?.page || 0}
        itemsPerPage={pagedPrices?.limit || 1}
        onNavigate={(paging) => setSearchParams(serializePagingQuery(paging))}
      />
      <StripePricePull
        passport={props.passport}
        live={props.live}
        show={showForm}
        onHide={() => {
          setShowForm(false);
        }}
      />
    </>
  );
}

function StripePriceTable(
  props: {
    prices: StripePrice[]
  }
) {
  return (
    <Table
      head={
        <TableHead
          cols={tableHeaders.price}
        />
      }
    >
      <TableBody
        rows={props.prices.map(buildPriceRow)}
      />
    </Table>
  )
}

function buildPriceRow(p: StripePrice): TRow {
  return {
    key: p.id,
    data: [
      <Link to={sitemap.stripePriceOf(p.id)}>{p.id}</Link>,
      concatPriceParts(newStripePriceParts(p)),
      localizeActive(p.onPaywall),
      p.kind,
      readableYMD(p.periodCount),
      p.startUtc || 'NULL',
      p.endUtc || 'NULL',
    ],
  }
}
