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
