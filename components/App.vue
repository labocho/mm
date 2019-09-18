<template>
  <div class="ui-box">
    <link rel="stylesheet" href="/application.css"></link>
    <div id="tenkey" class="ui">
      <div class="row" style="height: 24%">
        <div class="lcd col-12">
          <input name="bpm" type="number" :value="bpmText" :style="bpmStyle"></input>
          <font-awesome-icon icon="circle" ref="light" id="light" :style="{display: isRunning ? 'inline' : 'none'}" />
        </div>
      </div>
      <TenKey :initial-value="this.$store.state.displayBpm" style="height: 76%" />
    </div>
  </div>
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
    toggle() {
      this.app.toggle();
    },
  },
}
</script>

<style>
</style>
