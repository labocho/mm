<template lang="pug">
  div
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(7)" @mousedown.prevent="onTapNumkey(7)") 7
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(8)" @mousedown.prevent="onTapNumkey(8)") 8
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(9)" @mousedown.prevent="onTapNumkey(9)") 9
      a.col-3.tenkey-key
        font-awesome-icon(icon="chevron-up" @touchstart.prevent="onTapAdd(1)" @mousedown.prevent="onTapAdd(1)")
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(4)" @mousedown.prevent="onTapNumkey(4)") 4
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(5)" @mousedown.prevent="onTapNumkey(5)") 5
      a.col-3.tenkey-key(@touchstart.prevent="onTapNumkey(6)" @mousedown.prevent="onTapNumkey(6)") 6
      a.col-3.tenkey-key
        font-awesome-icon(icon="chevron-down" @touchstart.prevent="onTapAdd(-1)" @mousedown.prevent="onTapAdd(-1)")
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
  data() {
    return {
      value: this.$store.state.bpm,
    };
  },
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
      this.value += i;
      this.$store.dispatch("updateDisplayBpm", this.value);
    },
    onTapNumkey(i) {
      if (this.$store.state.numKeyTimeoutTimer === null) {
        this.value = i;
      } else {
        this.value = (this.value * 10 + i) % 1000;
      }

      this.$store.dispatch("numkeyTapped", new Date().getTime());
      this.$store.dispatch("updateDisplayBpm", this.value);
    },
    onTapTapkey() {
      this.$store.dispatch("tap", new Date().getTime());
    },
    onTapToggle() {
      this.$store.dispatch("toggle");
    },
  },
}
</script>
