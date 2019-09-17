<template>
  <div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(7)">7</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(8)">8</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(9)">9</a>
    </div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(4)">4</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(5)">5</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(6)">6</a>
    </div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(1)">1</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(2)">2</a>
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(3)">3</a>
    </div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickNumkey(0)">0</a>
      <a class="col-4 tenkey-key" />
      <a class="col-4 tenkey-key" @touchstart.prevent="onClickToggle">▶</a>
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
    onClickNumkey(i) {
      this.value = (this.value * 10 + i) % 1000;

      this.$store.dispatch("updateDisplayBpm", this.value);
      this.$store.dispatch("updateBpm", this.validValue);
    },
    onClickToggle() {
      this.$store.dispatch("toggle");
    },
  },
  mouted() {
    this.value = this.initialValue
  },
}
</script>
