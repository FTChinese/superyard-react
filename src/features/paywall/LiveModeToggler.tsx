import { useRecoilState } from 'recoil';
import { Toggler } from '../../components/controls/Toggler';
import { liveModeState } from '../../store/recoil-state';

export function LiveModeToggler() {

  const [ live, setLive ] = useRecoilState(liveModeState);

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


