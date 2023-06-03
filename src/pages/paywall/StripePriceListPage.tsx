import { useEffect, useState } from 'react';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { useStripeList } from '../../features/stripe/useStripeList';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
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
import { useProgress } from '../../components/hooks/useProgress';
import { toast } from 'react-toastify';
import { StripePricePull } from '../../features/stripe/StripePriceDialog';
import { ReqConfig } from '../../http/ReqConfig';

export function StripePriceListPage() {
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

  const config: ReqConfig = {
    live: props.live,
    token: props.passport.token,
  };

  const [showForm, setShowForm] = useState(false);

  const { progress } = useProgress();
  const {
    pagedPrices,
    listPrices,
    onPriceFound,
  } = useStripeList();

  const [searchParams, setSearchParams] = useSearchParams();

  const paging = getPagingQuery(searchParams);

  useEffect(() => {
    listPrices(
      config,
      paging,
    );

    window.scrollTo(0, 0);
  }, [paging.page, paging.itemsCount]);

  return (
    <>
      <Stack direction="horizontal">
        <h2 className="mb-3">Stripe Prices</h2>
        <ButtonGroup
          className="ms-auto"
        >
          <Button
            variant="outline-primary"
            disabled={progress}
            onClick={() => setShowForm(true)}
          >
            Pull
          </Button>
          <Button
            disabled={progress}
            onClick={() => {
              toast.warn('Not implemented yet!')
            }}
          >
            New
          </Button>
        </ButtonGroup>
      </Stack>
      <ul>
        <li>Click New to create a new Stripe price (this feature is not finished yet!)</li>
        <li>Click Pull to use an existing Stripe price from its dashboard</li>
      </ul>
      {
        pagedPrices &&
        <>
          <StripePriceTable
            prices={pagedPrices.data}
          />

          <Pagination
            totalItem={pagedPrices?.total || 0}
            currentPage={pagedPrices?.page || 0}
            itemsPerPage={pagedPrices?.limit || 1}
            onNavigate={(paging) => setSearchParams(serializePagingQuery(paging))}
          />
        </>
      }

      <StripePricePull
        config={config}
        show={showForm}
        onHide={() => {
          setShowForm(false);
        }}
        onFound={onPriceFound}
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
