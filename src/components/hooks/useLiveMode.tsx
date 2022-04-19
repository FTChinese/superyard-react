import { atom, useRecoilState } from 'recoil';

export const liveModeState = atom({
  key: 'liveMode',
  default: true,
});

export function useLiveMode() {
  const [ live, setLive ] = useRecoilState(liveModeState);

  const toggle = () => {
    setLive(prev => !prev);
  }

  return {
    live,
    toggle,
    setLive,
  };
}
