import ClickScheduler from "~/lib/ClickScheduler";
import Light from "~/lib/Light";
import LightScheduler from "~/lib/LightScheduler";

interface SafariWindow {
  webkitAudioContext: AudioContext;
}

const context = new (window.AudioContext || (<SafariWindow><unknown>window).webkitAudioContext)()
const clickScheduler = new ClickScheduler({ context, bpm: 60 });
let lightScheduler: LightScheduler | null = null;

interface State {
  bpm: number;
  displayBpm: number;
  running: boolean;
}

export const state = () => ({
  bpm: 60,
  displayBpm: 60,
  running: false,
})

export const mutations = {
  updateBpm(state: State, bpm: number) {
    state.bpm = bpm;
  },
  updateDisplayBpm(state: State, bpm: number) {
    state.displayBpm = bpm;
  },
  toggle(state: State) {
    state.running = !state.running;
    state.displayBpm = state.bpm;
  },
}

export const actions = {
  setLight({ commit }: any, light: Light) {
    lightScheduler = new LightScheduler(light);
  },
  updateBpm({ commit, state }: any, bpm: number) {
    commit("updateBpm", bpm);
    clickScheduler.bpm = bpm;
  },
  updateDisplayBpm({ commit }: any, bpm: number) {
    commit("updateDisplayBpm", bpm);
  },
  toggle({ commit, state, dispatch }: any) {
    commit("toggle");
    if (state.running) {
      clickScheduler.clickNow();
      window.requestAnimationFrame((timestamp: number) => {
        dispatch("tick", timestamp)
      });
    }
  },
  tick({ state, dispatch }: any, timestamp: number) {
    let r = null;
    if (state.running) {
      r = clickScheduler.enqueue(timestamp);
    }
    if (lightScheduler) {
      lightScheduler.tick(timestamp, r);
    }
    window.requestAnimationFrame((timestamp: number) => {
      dispatch("tick", timestamp)
    });
  },
}
