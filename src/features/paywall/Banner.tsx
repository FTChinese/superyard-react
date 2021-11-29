import { ImageRatio } from '../../components/graphics/ImageRatio';
import { TextList } from '../../components/list/TextList';
import { Banner, Promo } from '../../data/paywall';

/**
 * @description - BannerBox shows a banner's content shared by default banner and promo banner.
 */
function BannerBox(
  props: {
    banner: Banner;
  }
) {
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

export function BannerCard(
  props: {
    banner: Banner;
  }
) {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Default Banner</span>
        <button className="btn btn-primary btn-sm">Edit</button>
      </div>

      <div className="card-body">
        <BannerBox banner={props.banner} />
      </div>
    </div>
  );
}

export function PromoCard(
  props: {
    promo: Promo;
  }
) {

  const isEmpty = props.promo.id === '';

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Promotion Banner</span>

        <div className="btn-group">
          { !isEmpty && <button className="btn btn-danger btn-sm">Drop</button>}
          <button className="btn btn-primary btn-sm">New</button>
        </div>
      </div>

      <div className="card-body">
        { isEmpty && <p>Not promotion set.</p>}
        { !isEmpty && <BannerBox banner={props.promo} />}
        { props.promo.terms && <TextList text={props.promo.terms} />}
      </div>

      <div className="card-footer">
        Duration: {props.promo.startUtc} to {props.promo.endUtc}
      </div>
    </div>
  );
}
