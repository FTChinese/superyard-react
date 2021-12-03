import { atom } from 'recoil';
import { Paywall } from '../data/paywall';

export const paywallRebuiltState = atom<Paywall>({
  key: 'paywallRebuilt',
  default: {
    id: 0,
    banner: {
      id: '',
      heading: '',
    },
    promo: {
      id: '',
      heading: '',
      startUtc: '',
      endUtc: '',
    },
    liveMode: false,
    products: [],
  },
});

export const liveModeState = atom({
  key: 'liveMode',
  default: true,
});
