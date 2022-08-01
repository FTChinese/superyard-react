import { atom, useRecoilState } from 'recoil';

const progressState = atom<boolean>({
  key: 'loadingState',
  default: false,
});

export function useProgress() {
  const [progress, setProgress] = useRecoilState(progressState);

  const startProgress = () => {
    setProgress(true);
  }

  const stopProgress = () => {
    setProgress(false);
  }
  return {
    progress,
    startProgress,
    stopProgress,
    setProgress,
  }
}

