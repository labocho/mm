<template lang="pug">
  .ui-box
    #debug(style="position: absolute; color: #f00; top: 0; left: 0; width: 100%; font-size: 12px; word-break: break-word;")
    link(rel="stylesheet", href="/application.css")
    #tenkey.ui
      .row(style="height: 40%")
        .lcd.col-12
          font-awesome-icon#reload(icon="redo", @click="reload")
          input(name="bpm", type="number", :value="bpmText", :style="bpmStyle" readonly)
          font-awesome-icon#light(ref="light", icon="circle", :style="{display: isRunning ? 'inline' : 'none'}")
      .row(style="height: 8%")
        .col-12
          vue-slider(
            style="width: 100%; margin: 0 10% auto 10%;"
            :value="this.$store.state.volume"
            @change="onChangeVolume"
            :dotSize="32"
            :min="0"
            :max="1"
            :interval="0.01"
            :process="false"
            tooltip="none"
            :dotOptions="{focusStyle: {boxShadow: 'none'}}"
          )
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
    onChangeVolume(value) {
      this.$store.dispatch("updateVolume", value);
    },
    reload() {
      location.reload(true);
    },
  },
}
</script>

<style>
</style>
