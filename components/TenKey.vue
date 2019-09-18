<template>
  <div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(7)" @mousedown.prevent="onTapNumkey(7)" >7</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(8)" @mousedown.prevent="onTapNumkey(8)" >8</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(9)" @mousedown.prevent="onTapNumkey(9)" >9</a>
    </div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(4)" @mousedown.prevent="onTapNumkey(4)" >4</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(5)" @mousedown.prevent="onTapNumkey(5)" >5</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(6)" @mousedown.prevent="onTapNumkey(6)" >6</a>
    </div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(1)" @mousedown.prevent="onTapNumkey(1)" >1</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(2)" @mousedown.prevent="onTapNumkey(2)" >2</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(3)" @mousedown.prevent="onTapNumkey(3)" >3</a>
    </div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapNumkey(0)" @mousedown.prevent="onTapNumkey(0)" >0</a>
      <a class="col-4 tenkey-key" />
      <a class="col-4 tenkey-key" @touchstart.prevent="onTapToggle" @mousedown.prevent="onTapToggle">
        <font-awesome-icon v-if="!isRunning" icon="play" />
        <font-awesome-icon v-if="isRunning" icon="pause" />
      </a>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    initialValue: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      value: null,
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
    onTapNumkey(i) {
      this.value = (this.value * 10 + i) % 1000;
      this.$store.dispatch("updateDisplayBpm", this.value);
    },
    onTapToggle() {
      this.$store.dispatch("toggle");
    },
  },
  mouted() {
    this.value = this.initialValue
  },
}
</script>
