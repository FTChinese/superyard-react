import { Toggler } from '../../components/controls/Toggler';
import { useLiveMode } from '../../components/hooks/useLiveMode';

export function LiveModeToggler() {

  const { live, setLive} = useLiveMode();

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


