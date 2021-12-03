import { useRecoilState } from 'recoil';
import { liveModeState } from './recoil-state';

export function useLiveState() {
  const [live, setLive] = useRecoilState(liveModeState);

  return {
    live,
    setLive,
  };
}
