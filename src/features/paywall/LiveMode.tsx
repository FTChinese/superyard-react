import { useRecoilState } from 'recoil';
import { Switch } from '../../components/controls/Switch';
import { liveModeState } from '../../store/state';

export function LiveMode() {

  const [live, setLive] = useRecoilState(liveModeState);

  return (
    <div className={live ? '' : 'text-danger'}>
      <Switch
        key="live"
        label={live ? 'Live Mode' : 'Sandbox Mode'}
        checked={live}
        onToggle={setLive}
      />
    </div>
  );
}
