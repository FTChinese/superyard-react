import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { LegalList, LegalTeaser } from '../../data/legal';
import { OnNavigatePage, Pagination } from '../../components/Pagination';
import { PublishBadge } from '../../components/text/Badge';
import { Link } from 'react-router-dom';

export function LegalListScreen(
  props: {
    docList?: LegalList;
    onClickNew: () => void;
    onNavigate: OnNavigatePage;
  }
) {
  return (
    <Row className="justify-content-center">
      <Col md={10} lg={8}>

        <PageHeader
          onClick={props.onClickNew}
        />

        {
          props.docList && props.docList.data.map(item =>
            <TeaserItem
              teaser={item}
              key={item.id}
            />
          )
        }

        {
          props.docList && <Pagination
            totalItem={props.docList.total}
            currentPage={props.docList.page}
            itemsPerPage={props.docList.limit}
            onNavigate={props.onNavigate}
          />
        }
      </Col>
    </Row>
  );
}

function PageHeader(
  props: {
    onClick: () => void;
  }
) {
  return (
    <Stack>
      <h2 className="mb-3">Legal Documents</h2>
      <Button
        className="ms-auto"
        variant="primary"
        onClick={ props.onClick }
      >
        New
      </Button>
    </Stack>
  );
}

function TeaserItem(
  props: {
    teaser: LegalTeaser,
  }
) {

  return (
    <Card className="mb-3">
      <Card.Header>
        <PublishBadge active={props.teaser.active} />
      </Card.Header>
      <Card.Body>
        <Link to={props.teaser.id}>
          {props.teaser.title}
        </Link>
        <p>
          {props.teaser.summary}
        </p>
      </Card.Body>
    </Card>
  )
}
