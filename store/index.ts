import ClickScheduler from "~/lib/ClickScheduler";
import Light from "~/lib/Light";
import LightScheduler from "~/lib/LightScheduler";
import NoSleep from "nosleep.js";

interface SafariWindow {
  webkitAudioContext: AudioContext;
}

const noSleep = new NoSleep();
const context = new (window.AudioContext || (<SafariWindow><unknown>window).webkitAudioContext)()
const clickScheduler = new ClickScheduler({ context, bpm: 60 });
let lightScheduler: LightScheduler | null = null;

interface State {
  bpm: number;
  displayBpm: number;
  numKeyTimeoutTimer: number | null;
  running: boolean;
  tapBegin: number | null;
  tapTimeoutTimer: number | null;
}

export const state = () => ({
  bpm: 60,
  displayBpm: 60,
  numKeyTimeoutTimer: null,
  running: false,
  tapBegin: null,
  tapTimeoutTimer: null,
})

export const getters = {
  isBpmValid(state: State) {
    return state.bpm === state.displayBpm;
  }
}

export const mutations = {
  updateBpm(state: State, bpm: number) {
    state.bpm = bpm;
  },
  updateDisplayBpm(state: State, bpm: number) {
    state.displayBpm = bpm;
  },
  updateNumKeyTimeoutTimer(state: State, timer: number | null) {
    state.numKeyTimeoutTimer = timer;
  },
  updateTapBegin(state: State, timestamp: number | null) {
    state.tapBegin = timestamp;
  },
  updateTapTimeoutTimer(state: State, timer: number | null) {
    if (state.tapTimeoutTimer !== null) {
      window.clearTimeout(state.tapTimeoutTimer);
    }
    state.tapTimeoutTimer = timer;
  },
  start(state: State) {
    state.running = true;
    state.displayBpm = state.bpm;
  },
  stop(state: State) {
    state.running = false;
  },
}

  export const actions = {
  setLight({ commit }: any, light: Light) {
    lightScheduler = new LightScheduler(light);
  },
  updateDisplayBpm({ commit }: any, bpm: number) {
    commit("updateDisplayBpm", bpm);

    if (30 <= bpm && bpm < 300) {
      commit("updateBpm", bpm);
      clickScheduler.bpm = bpm;
    }
  },
  start({ commit, dispatch }: any) {
    commit("start");
    clickScheduler.clickNow();
    window.requestAnimationFrame((timestamp: number) => {
      dispatch("tick", timestamp)
    });
    noSleep.enable();
  },
  stop({ commit }: any) {
    commit("stop");
    noSleep.disable();
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
  tap({ commit, dispatch, state }: any, timestamp: number) {
    if (state.tapBegin === null) {
      const timer = window.setTimeout(() => {
        commit("updateTapBegin", null);
      }, 2000); // 30bpm まで待つ

      commit("updateTapBegin", timestamp);
      commit("updateTapTimeoutTimer", timer);
    } else {
      const bpm = 1 / ((timestamp - state.tapBegin) / 1000 / 60);

      commit("updateTapBegin", null);
      commit("updateTapTimeoutTimer", null);
      dispatch("updateDisplayBpm", Math.round(bpm % 1000));

      if (!state.running) {
        dispatch("start");
      }
    }
  },
  numkeyTapped({ commit, state }: any, timestamp: number) {
    if (state.numKeyTimeoutTimer !== null) {
      clearTimeout(state.numKeyTimeoutTimer);
    }

    const timer = setTimeout(() => {
      commit("updateNumKeyTimeoutTimer", null);
    }, 2000);
    commit("updateNumKeyTimeoutTimer", timer);
  },
}
