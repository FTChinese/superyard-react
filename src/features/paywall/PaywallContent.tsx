import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify';
import { TextList } from '../../components/list/TextList';
import { CMSPassport } from '../../data/cms-account';
import { Paywall, PaywallDoc, Promo } from '../../data/paywall';
import { dropPromo, savePromo } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { ModeBadge } from '../../components/text/Badge';
import { BannerFormVal, BannerForm, buildPromoParams } from './BannerForm';
import { EffectivePeriod } from './EffectivePeriod';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { ProductCard } from './ProductCard';
import { BannerCard, PromoCard } from './BannerCard';

export function PaywallContent(
  props: {
    passport: CMSPassport;
    paywall: Paywall;
  }
) {

  return (
    <div>
      <BannerCard
        banner={props.paywall.banner}
        passport={props.passport}
      />
      <PromoCard
        promo={props.paywall.promo}
        passport={props.passport}
      />

      <div className="row row-cols-1 row-cols-md-2">
        {
          props.paywall.products.map(product => (
            <div
              className="col"
              key={product.id}
            >
              <ProductCard
                product={product}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}


