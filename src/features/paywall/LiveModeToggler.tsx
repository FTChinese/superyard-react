import { Toggler } from '../../components/controls/Toggler';
import { useLiveState } from '../../store/useLiveState';

export function LiveModeToggler() {

  const { live, setLive } = useLiveState();

  return (
    <div className={live ? '' : 'text-danger'}>
      <Toggler
        name="live"
        label={live ? 'Live Mode' : 'Sandbox Mode'}
        checked={live}
        onToggle={setLive}
      />
    </div>
  );
}


