<template lang="pug">
  div
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(7)") 7
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(8)") 8
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(9)") 9
      a.col-3.tenkey-key
        font-awesome-icon(icon="chevron-up" @touchstart.prevent="onClickAdd(1)")
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(4)") 4
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(5)") 5
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(6)") 6
      a.col-3.tenkey-key
        font-awesome-icon(icon="chevron-down" @touchstart.prevent="onClickAdd(-1)")
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(1)") 1
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(2)") 2
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(3)") 3
      a.col-3.tenkey-key
    .row(style="height: 25%")
      a.col-3.tenkey-key(@touchstart.prevent="onClickNumkey(0)") 0
      a.col-3.tenkey-key
      a.col-3.tenkey-key
      a.col-3.tenkey-key(@touchstart.prevent="onClickToggle")
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
    onClickAdd(i) {
      this.value += i;
      this.$store.dispatch("updateDisplayBpm", this.value);
    },
    onClickNumkey(i) {
      this.value = (this.value * 10 + i) % 1000;
      this.$store.dispatch("updateDisplayBpm", this.value);
    },
    onClickToggle() {
      this.$store.dispatch("toggle");
    },
  },
}
</script>
