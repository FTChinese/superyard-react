import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { CircleLoader } from '../../components/progress/CircleLoader';
import { PublishBadge } from '../../components/text/Badge';
import { LegalDoc } from '../../data/legal';

export function LegalDetailScreen(
  props: {
    doc: LegalDoc;
  } & DocMenuProps
) {
  return (
    <Row>
      <Col sm={12} md={9}>
        <DocDetails doc={props.doc} />
      </Col>
      <Col sm={12} md={3}>
        <DocMenu {...props} />
      </Col>
    </Row>
  );
}

function DocDetails(
  props: {
    doc: LegalDoc;
  }
) {
  return (
    <section>
      <h2>
        {props.doc.title}
      </h2>

      <div className="mb-3 mt-3 border-bottom text-black60">
        <div>
          <PublishBadge active={props.doc.active} />
          {
            props.doc.active && <a
              href={`https://next.ftacademy.cn/terms/${props.doc.id}?refresh=true`}
              target="_blank"
              className="ms-3"
            >
              Refresh and Preview this article
            </a>
          }
        </div>
        <div>Published by <em>{props.doc.author}</em>, {props.doc.createdUtc}</div>
        <div>Lasted updated {props.doc.updatedUtc}</div>
      </div>

      <div>
        {props.doc.body.split('\n').map((line, i) => <p key={i}>{line}</p>)}
      </div>
    </section>
  )
}

type DocMenuProps = {
  published: boolean;
  publishing: boolean;
  onPublish: () => void;
  onEdit: () => void;
};

function DocMenu(
  props: DocMenuProps,
) {
  return (
    <div className="d-flex flex-row flex-md-column justify-content-between mt-3">
      <Button
        className="mb-3" size="sm"
        onClick={props.onPublish}
        disabled={props.publishing}
      >
        <CircleLoader progress={props.publishing} />
        {props.published ? 'Undo Publish' : 'Publish'}
      </Button>
      <Button
        className="mb-3" size="sm"
        onClick={props.onEdit}
        disabled={props.publishing}
      >
        Edit
      </Button>
    </div>
  );
}
