import { Outlet } from 'react-router-dom';
import { LiveModeToggler } from '../../features/paywall/LiveModeToggler';
import { RebuildButton } from '../../features/paywall/RebuildButton';
import { useEffect, useState } from 'react';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { usePaywall } from '../../components/hooks/usePaywall';
import { CMSPassport } from '../../data/cms-account';
import { ReqConfig } from '../../http/ReqConfig';
import { BannerCard, PromoCard } from '../../features/paywall/BannerCard';
import { BannerDialog, DropPromoDialog, NewPromoDialog } from '../../features/paywall/BannerDialog';
import { collectProductItems } from '../../data/paywall';
import { ProductCard } from '../../features/paywall/ProductCard';

/**
 * PaywallLayout provides a shared banner with two buttons:
 * - toggle live/sandbox mode
 * - rebuild paywall data
 */
export function PaywallLayout() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <LiveModeToggler />
        <RebuildButton />
      </div>
      <Outlet />
    </>
  );
}

export function PaywallPage() {
  const { live } = useLiveMode();
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <PaywallPageScreen
      passport={passport}
      live={live}
    />
  );
}

function PaywallPageScreen(
  props: {
    passport: CMSPassport;
    live: boolean;
  }
) {

  const [showBannerEdit, setShowBannerEdit] = useState(false);
  const [showPromoCreate, setShowPromoCreate] = useState(false);
  const [showPromoDrop, setShowPromoDrop] = useState(false);

  const {
    forceLoadPaywall,
    paywall,
    onBannerUpdated,
    onPromoUpdated,
  } = usePaywall();

  const config: ReqConfig = {
    token: props.passport.token,
    live: props.live,
  };

  useEffect(() => {
    console.log(
      `Retrieving paywall data for ${props.live ? 'live' : 'sandbox'} mode`
    );

    forceLoadPaywall(config);
  }, [props.live]);

  if (!paywall) {
    return null;
  }

  const productList = collectProductItems(paywall);

  return (
    <div>
      <BannerCard
        banner={paywall.banner}
        onEdit={() => {
          setShowBannerEdit(true);
        }}
      />
      <BannerDialog
        config={config}
        show={showBannerEdit}
        onHide={() => {
          setShowBannerEdit(false);
        }}
        banner={paywall.banner}
        onSaved={(pwd) => {
          onBannerUpdated(pwd.banner);
        }}
      />

      <PromoCard
        promo={paywall.promo}
        onDrop={() => setShowPromoDrop(true)}
        onCreate={() => setShowPromoCreate(true)}
      />

      <NewPromoDialog
        config={config}
        show={showPromoCreate}
        onHide={() => setShowPromoCreate(false)}
        promo={paywall.promo}
        onSaved={(pwd) => {
          onPromoUpdated(pwd.promo);
        }}
      />
      <DropPromoDialog
        config={config}
        show={showPromoDrop}
        onHide={() => setShowPromoDrop(false)}
        onSaved={(pwd) => {
          onPromoUpdated(pwd.promo);
          setShowPromoDrop(false);
        }}
      />

      <div className="row row-cols-1 row-cols-md-2">
        {
          productList.map(item => (
            <div
              className="col"
              key={item.product.id}
            >
              <ProductCard
                product={item.product}
                ftc={item.ftcPrices}
                stripe={item.stripePrices}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}
