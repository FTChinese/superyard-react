import { atom } from "recoil";

export const liveModeState = atom({
  key: 'liveMode',
  default: true,
});
