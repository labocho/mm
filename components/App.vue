<template>
  <div class="ui-box">
    <link rel="stylesheet" href="/application.css"></link>
    <div id="tenkey" class="ui">
      <div class="row" style="height: 24%">
        <div class="lcd col-12">
          <input name="bpm" type="number" :value="bpmText"></input>
          <canvas id="light" ref="light" height="36" width="36" />
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
    bpmText() {
      let s = this.$store.state.displayBpm.toString();
      while (s.length < 3) {
        s = "0" + s;
      }
      return s;
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
