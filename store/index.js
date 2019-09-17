import ClickScheduler from "~/lib/ClickScheduler";
import LightScheduler from "~/lib/LightScheduler";

const context = new (window.AudioContext || window.webkitAudioContext)()
const clickScheduler = new ClickScheduler({ context, bpm: 60 });
let lightScheduler = null;

export const state = () => ({
  bpm: 60,
  displayBpm: 60,
  running: false,
})

export const mutations = {
  updateBpm(state, bpm) {
    state.bpm = bpm;
  },
  updateDisplayBpm(state, bpm) {
    state.displayBpm = bpm;
  },
  toggle(state) {
    state.running = !state.running;
    state.displayBpm = state.bpm;
  },
}

export const actions = {
  setLight({ commit }, light) {
    lightScheduler = new LightScheduler(light);
  },
  updateBpm({ commit, state }, bpm) {
    commit("updateBpm", bpm);
    clickScheduler.bpm = bpm;
  },
  updateDisplayBpm({ commit }, bpm) {
    commit("updateDisplayBpm", bpm);
  },
  toggle({ commit, state, dispatch }) {
    commit("toggle");
    if (state.running) {
      clickScheduler.clickNow();
      window.requestAnimationFrame((timestamp) => {
        dispatch("tick", timestamp)
      });
    }
  },
  tick({ state, dispatch }, timestamp) {
    let r = null;
    if (state.running) {
      r = clickScheduler.enqueue(timestamp);
    }
    if (lightScheduler) {
      lightScheduler.tick(timestamp, r);
    }
    window.requestAnimationFrame((timestamp) => {
      dispatch("tick", timestamp)
    });
  },
}
