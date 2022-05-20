import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Release, ReleaseList } from '../../data/android';
import { Link } from 'react-router-dom';
import { TextList } from '../../components/list/TextList';
import { OnNavigatePage, Pagination } from '../../components/Pagination';

export function ReleaseListScreen(
  props: {
    releaseList?: ReleaseList;
    onClickNew: () => void;
    onNavigatePage: OnNavigatePage;
  }
) {
  return (
    <Row className="justify-content-center">
      <Col md={10} lg={8}>
        <PageHeader
          onClick={props.onClickNew}
        />

        {
          props.releaseList && props.releaseList.data.map(item =>
            <ReleaseItem
              release={item}
              key={item.versionCode}
            />
          )
        }

        {
          props.releaseList && <Pagination
            totalItem={props.releaseList.total}
            currentPage={props.releaseList.page}
            itemsPerPage={props.releaseList.limit}
            onNavigate={props.onNavigatePage}
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
    <Stack direction="horizontal">
      <h2>Android Releases</h2>
      <Button
        className="ms-auto"
        variant="primary"
        onClick={props.onClick}
      >
        New
      </Button>
    </Stack>
  )
}

function ReleaseItem(
  props: {
    release: Release
  }
) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <Link to={`${props.release.versionName}`}>
            {props.release.versionName}
          </Link>
        </Card.Title>

        {
          props.release.body &&
          <TextList
            text={props.release.body}
          />
        }

        <dl>
          <dt>Version Code</dt>
          <dd>{props.release.versionCode}</dd>
          <dt>Download APK</dt>
          <dd>{props.release.apkUrl}</dd>
        </dl>
      </Card.Body>
    </Card>
  );
}
