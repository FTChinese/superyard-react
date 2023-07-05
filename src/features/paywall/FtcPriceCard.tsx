import Card from 'react-bootstrap/Card';
import { AliPayBrand, WxPayBrand } from '../../components/graphics/icons';
import { Table, TableBody, TableHead, TRow } from '../../components/list/Table';
import { ISOTimeColumn } from '../../components/text/DateTimeBlock';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { YMDColumn } from '../../components/text/YMDColumn';
import { Discount, formatDiscountAmount, newFtcPriceParts } from '../../data/ftc-price';
import { PaywallPrice } from '../../data/paywall';
import { readableYMD } from '../../data/ymd';
import { Link } from 'react-router-dom';
import { Flex } from '../../components/layout/Flex';
import { sitemap } from '../../data/sitemap';

/**
 * FtcPriceCard is an overview of a ftc price visible on paywall.
 */
export function FtcPriceCard(
  props: {
    price: PaywallPrice;
  }
) {

  const priceRows: TRow[] = [
    {
      head: 'Kind',
      data: [
        props.price.kind,
      ],
    },
    {
      head: 'Duration',
      data: [
        readableYMD(props.price.periodCount),
      ]
    },
  ]
  return (
    <Card className="mb-3">
      <Card.Header>
        <Flex
          start={
            <div>
              <span className="me-3">
                <AliPayBrand />
              </span>
              <span>
                <WxPayBrand />
              </span>
            </div>
          }
          end={
            <Link to={sitemap.ftcPriceOf(props.price.id)}>
              Edit
            </Link>
          }
        />
      </Card.Header>

      <Card.Body>
        <Card.Title className="text-center">
          <PriceHighlight
            parts={newFtcPriceParts(props.price)}
          />
        </Card.Title>

        <Table
          caption="Ftc Price Details"
        >
          <TableBody
            rows={priceRows}
          />
        </Table>

        {
          props.price.offers.length > 0 &&
          <PriceOfferList
            offers={props.price.offers}
          />
        }
      </Card.Body>
    </Card>
  );
}

function PriceOfferList(
  props: {
    offers: Discount[];
  }
) {

  const headRow = <TableHead
    cols={['Kind', 'Override Period', 'Price Off', 'Start', 'End']}
  />

  const offerRows: TRow[] = props.offers.map((o) => {
    return {
      head: o.kind,
      data: [
        <YMDColumn
          ymd={o.overridePeriod}
          direction="column"
        />,
        formatDiscountAmount(o),
        <ISOTimeColumn
          date={o.startUtc}
        />,
        <ISOTimeColumn
          date={o.endUtc}
        />,
      ]
    };
  })

  if (props.offers.length == 0) {
    return <></>;
  }

  return (
    <Table
      caption="Offers"
      head={headRow}
    >
      <TableBody
        rows={offerRows}
      />
    </Table>
  );
}


