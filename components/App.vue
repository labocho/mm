<template>
  <div class="ui-box">
    <link rel="stylesheet" href="/application.css"></link>
    <div id="tenkey" class="ui">
      <div class="row" style="height: 24%">
        <div class="lcd col-12">
          <input name="bpm" type="number" value="120"></input>
          <canvas id="light" height="36" width="36" />
        </div>
      </div>
      <TenKey :initial-value="this.$store.state.displayBpm" @toggle="toggle" style="height: 76%" />
    </div>
  </div>
</template>

<script>
import TenKey from "./TenKey.vue";
import Light from "~/lib/Light";
import LightScheduler from "~/lib/LightScheduler";
import ClickScheduler from "~/lib/ClickScheduler";

class App {
  constructor(store) {
    this.store = store;
    const context = new (window.AudioContext || window.webkitAudioContext)();
    this.clickScheduler = new ClickScheduler({ context, bpm: store.state.bpm });
    store.subscribe(() => {
      this.clickScheduler.bpm = store.state.bpm;
    });

    const light = new Light(document.querySelector("#light"));
    this.lightScheduler = new LightScheduler(light);

    store.subscribe(() => {
      let s = store.state.displayBpm.toString();
      while (s.length < 3) {
        s = "0" + s;
      }
      document.querySelector("[name=bpm]").value = s;
    });
  }

  toggle() {
    this.store.commit("toggle");
    if (this.store.state.running) {
      this.clickScheduler.clickNow();
      window.requestAnimationFrame(this.tick.bind(this));
    }
  }

  tick(timestamp) {
    let r = null;
    if (this.store.state.running) {
      r = this.clickScheduler.enqueue(timestamp);
    }
    this.lightScheduler.tick(timestamp, r);
    window.requestAnimationFrame(this.tick.bind(this));
  }
}

export default {
  components: {
    TenKey,
  },
  mounted() {
    this.app = new App(this.$store);
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
