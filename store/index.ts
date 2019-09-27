import ClickScheduler from "~/lib/ClickScheduler";
import Light from "~/lib/Light";
import LightScheduler from "~/lib/LightScheduler";
import NoSleep from "nosleep.js";

interface SafariWindow {
  webkitAudioContext: AudioContext;
}

const INITIAL_BPM = parseInt(localStorage.getItem("bpm") || "60", 10);
const INITIAL_VOLUME = parseFloat(localStorage.getItem("volume") || "1.0");
const BPM_MIN = 30;
const BPM_MAX = 299;
const TAP_TIMEOUT = 2000; // 30bpm まで待つ
const NUM_KEY_TIMEOUT = 2000;

const noSleep = new NoSleep();
const context = new (window.AudioContext || (<SafariWindow><unknown>window).webkitAudioContext)()
const clickScheduler = new ClickScheduler({ context, bpm: INITIAL_BPM });
let lightScheduler: LightScheduler | null = null;

interface State {
  bpm: number;
  displayBpm: number;
  numKeyTimeoutTimer: number | null;
  running: boolean;
  tapBegin: number | null;
  tapTimeoutTimer: number | null;
  volume: number;
}

export const state = () => ({
  bpm: INITIAL_BPM,
  displayBpm: INITIAL_BPM,
  numKeyTimeoutTimer: null,
  running: false,
  tapBegin: null,
  tapTimeoutTimer: null,
  volume: INITIAL_VOLUME,
})

export const getters = {
  isBpmValid(state: State) {
    return state.bpm === state.displayBpm;
  }
}

export const mutations = {
  updateBpm(state: State, bpm: number) {
    state.bpm = bpm;
    localStorage.setItem("bpm", bpm.toString());
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
  updateVolume(state: State, volume: number) {
    state.volume = volume;
    localStorage.setItem("volume", volume.toString());
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

    if (BPM_MIN <= bpm && bpm <= BPM_MAX) {
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
      r = clickScheduler.enqueue(timestamp, state.volume);
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
      }, TAP_TIMEOUT); // 30bpm まで待つ

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
    }, NUM_KEY_TIMEOUT);
    commit("updateNumKeyTimeoutTimer", timer);
  },
  updateVolume({ commit }: any, volume: number) {
    commit("updateVolume", volume);
  },
}
