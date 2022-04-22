import { atom, useRecoilState } from 'recoil';
import { Paywall } from '../../data/paywall';

const paywallState = atom<Paywall>({
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
    stripe: [],
  },
});

export function usePaywall() {
  const [paywall, setPaywall] = useRecoilState(paywallState);

  return {
    paywall,
    setPaywall,
  }
}

