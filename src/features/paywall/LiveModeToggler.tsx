import { Toggler } from '../../components/controls/Toggler';
import { useLiveMode } from '../../components/hooks/useLiveMode';

export function LiveModeToggler() {

  const { live, toggle } = useLiveMode();

  return (
    <div className={live ? '' : 'text-danger'}>
      <Toggler
        name="live"
        label={live ? 'Live Mode' : 'Sandbox Mode'}
        checked={live}
        onClick={toggle}
      />
    </div>
  );
}


