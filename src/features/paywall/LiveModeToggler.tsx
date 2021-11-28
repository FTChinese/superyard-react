import { Switch } from '../../components/controls/Switch';
import { useLiveState } from '../../store/useLiveState';

export function LiveModeToggler() {

  const { live, setLive } = useLiveState();

  return (
    <div className={live ? '' : 'text-danger'}>
      <Switch
        name="live"
        label={live ? 'Live Mode' : 'Sandbox Mode'}
        checked={live}
        onToggle={setLive}
      />
    </div>
  );
}


