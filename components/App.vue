<template lang="pug">
  .ui-box
    link(rel="stylesheet", href="/application.css")
    #tenkey.ui
      .row(style="height: 30%")
        .lcd.col-12
          input(name="bpm", type="number", :value="bpmText", :style="bpmStyle" readonly)
          font-awesome-icon#light(ref="light", icon="circle", :style="{display: isRunning ? 'inline' : 'none'}")
      .row(style="height: 20%")
        .col-12
          input(type="range" min="0" max="1" step="0.01" :value="this.$store.state.volume" @input="onChangeVolume" style="display: block; width: 90%; margin: 10px auto;")
      TenKey(style="height: 60%")
</template>

<script>
import TenKey from "./TenKey.vue";
import Light from "~/lib/Light";

export default {
  components: {
    TenKey,
  },
  computed: {
    isRunning() {
      return this.$store.state.running;
    },
    bpmStyle() {
      return {
        opacity: this.isBpmValid ? 1.0 : 0.5,
      }
    },
    bpmText() {
      let s = this.$store.state.displayBpm.toString();
      while (s.length < 3) {
        s = "0" + s;
      }
      return s;
    },
    isBpmValid() {
      return this.$store.getters.isBpmValid;
    },
  },
  mounted() {
    const light = new Light(this.$refs.light);
    this.$store.dispatch("setLight", light);
  },
  methods: {
    onChangeVolume(e) {
      this.$store.dispatch("updateVolume", parseFloat(e.target.value, 10));
    },
  },
}
</script>

<style>
</style>
