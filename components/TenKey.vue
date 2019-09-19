<template lang="pug">
  div
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(7)" @mousedown.prevent="onTapNumkey(7)") 7
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(8)" @mousedown.prevent="onTapNumkey(8)") 8
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(9)" @mousedown.prevent="onTapNumkey(9)") 9
      a.col-3.tenkey-key(@touchstart.prevent="onTapAdd(1)" @mousedown.prevent="onTapAdd(1)")
        font-awesome-icon(icon="chevron-up")
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(4)" @mousedown.prevent="onTapNumkey(4)") 4
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(5)" @mousedown.prevent="onTapNumkey(5)") 5
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(6)" @mousedown.prevent="onTapNumkey(6)") 6
      a.col-3.tenkey-key(@touchstart.prevent="onTapAdd(-1)" @mousedown.prevent="onTapAdd(-1)")
        font-awesome-icon(icon="chevron-down")
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(1)" @mousedown.prevent="onTapNumkey(1)") 1
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(2)" @mousedown.prevent="onTapNumkey(2)") 2
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(3)" @mousedown.prevent="onTapNumkey(3)") 3
      a.col-3.tenkey-key(:class="{active: $store.state.tapBegin !== null}" style="font-size: 50%;" @touchstart.prevent="onTapTapkey" @mousedown.prevent="onTapTapkey")
        | TAP
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(0)" @mousedown.prevent="onTapNumkey(0)") 0
      a.col-3.tenkey-key
      a.col-3.tenkey-key
      a.col-3.tenkey-key(@touchstart.prevent="onTapToggle" @mousedown.prevent="onTapToggle")
        font-awesome-icon(v-if="!isRunning", icon="play")
        font-awesome-icon(v-if="isRunning", icon="pause")
</template>

<script>

export default {
  computed: {
    isRunning() {
      return this.$store.state.running;
    },
    validValue() {
      if (this.value > 250) {
        return 250;
      }

      if (this.value < 20) {
        return 20;
      }

      return this.value;
    },
  },
  methods: {
    onTapAdd(i) {
      const n = (this.$store.state.displayBpm + i) % 1000;
      this.$store.dispatch("updateDisplayBpm", n);
    },
    onTapNumkey(i) {
      let n;
      if (this.$store.state.numKeyTimeoutTimer === null) {
        n = i;
      } else {
        n = this.trimTempo(this.$store.state.displayBpm * 10 + i);
      }

      this.$store.dispatch("numkeyTapped", new Date().getTime());
      this.$store.dispatch("updateDisplayBpm", n);
    },
    onTapTapkey() {
      this.$store.dispatch("tap", new Date().getTime());
    },
    onTapToggle() {
      if (this.$store.state.running) {
        this.$store.dispatch("stop");
      } else {
        this.$store.dispatch("start");
      }
    },
    trimTempo(n) {
      n = n % 1000;
      if (n > 299) {
        n = n % 100;
      }
      return n;
    },
  },
}
</script>
