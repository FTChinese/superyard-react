import { Switch } from '../../components/controls/Switch';
import { useLiveState } from '../../store/useLiveState';

export function LiveMode() {

  const { live, setLive } = useLiveState();

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
