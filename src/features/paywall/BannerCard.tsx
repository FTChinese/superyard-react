
import Card from 'react-bootstrap/Card';
import { ImageRatio } from '../../components/graphics/ImageRatio';
import { TextList } from '../../components/list/TextList';
import { Banner, Promo } from '../../data/paywall';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';

/**
 * @description - BannerBox shows a banner's content shared by default banner and promo banner.
 */
function BannerBox(props: { banner: Banner }) {
  return (
    <div className="row flex-row-reverse">
      <div className="col-sm-4">
        <ImageRatio src={props.banner.coverUrl} />
      </div>

      <div className="col-sm-8">
        <h1 className="card-title">{props.banner.heading}</h1>
        <h2 className="card-subtitle">{props.banner.subHeading}</h2>

        <div>{props.banner.content}</div>
      </div>
    </div>
  );
}

export function BannerCard(props: {
  banner: Banner;
  onEdit: () => void;
}) {

  return (
    <Card className="card mb-3">
      <Card.Header>
        <Stack direction='horizontal'>
          <span>Default Banner</span>
          <Button
            className='ms-auto'
            size="sm"
            onClick={props.onEdit}
          >
            Edit
          </Button>
        </Stack>
      </Card.Header>

      <Card.Body className="card-body">
        <BannerBox banner={props.banner} />
      </Card.Body>
    </Card>
  );
}

export function PromoCard(props: {
  promo: Promo;
  onDrop: () => void;
  onCreate: () => void;
}) {
  const isEmpty = props.promo.id === '';

  const body =
    props.promo.id === '' ? (
      <p>Not promotion set.</p>
    ) : (
      <>
        <BannerBox banner={props.promo} />

        <Card.Title className="mt-3">Terms and Conditions</Card.Title>
        {props.promo.terms && <TextList text={props.promo.terms} />}

        <Card.Subtitle className="mt-3">Effective</Card.Subtitle>

        <div>
          From {props.promo.startUtc} to {props.promo.endUtc}
        </div>
      </>
    );

  return (
    <Card className="card mb-3">
      <Card.Header>
        <Stack direction='horizontal'>
          <span>Promotion Banner</span>

          <ButtonGroup
            className='ms-auto'
          >
            {!isEmpty &&
              <Button
                variant="danger"
                size="sm"
                onClick={props.onDrop}
              >
                Drop
              </Button>
            }
            <Button
              size="sm"
              onClick={props.onCreate}
            >
              New
            </Button>
          </ButtonGroup>
        </Stack>

      </Card.Header>

      <Card.Body className="card-body">{body}</Card.Body>
    </Card>
  );
}
