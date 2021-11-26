import { atom, useRecoilState } from 'recoil';

export const liveModeState = atom({
  key: 'liveMode',
  default: true,
});

export function useLiveState() {
  const [live, setLive] = useRecoilState(liveModeState);

  return {
    live,
    setLive,
  };
}
