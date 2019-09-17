<template>
  <div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" href="#" name="numkey" value="7" @touchstart="onClickNumkey">7</a>
      <a class="col-4 tenkey-key" href="#" name="numkey" value="8" @touchstart="onClickNumkey">8</a>
      <a class="col-4 tenkey-key" href="#" name="numkey" value="9" @touchstart="onClickNumkey">9</a>
    </div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" href="#" name="numkey" value="4" @touchstart="onClickNumkey">4</a>
      <a class="col-4 tenkey-key" href="#" name="numkey" value="5" @touchstart="onClickNumkey">5</a>
      <a class="col-4 tenkey-key" href="#" name="numkey" value="6" @touchstart="onClickNumkey">6</a>
    </div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" href="#" name="numkey" value="1" @touchstart="onClickNumkey">1</a>
      <a class="col-4 tenkey-key" href="#" name="numkey" value="2" @touchstart="onClickNumkey">2</a>
      <a class="col-4 tenkey-key" href="#" name="numkey" value="3" @touchstart="onClickNumkey">3</a>
    </div>
    <div class="row" style="height: 25%">
      <a class="col-4 tenkey-key" href="#" name="numkey" value="0" @touchstart="onClickNumkey">0</a>
      <a class="col-4 tenkey-key" />
      <a id="toggle" class="col-4 tenkey-key" href="#" @touchstart="onClickToggle">▶</a>
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
    onClickNumkey(e) {
      const i = window.parseInt(e.target.textContent, 10);
      this.value = (this.value * 10 + i) % 1000;

      this.$store.commit("updateDisplayBpm", this.value);
      this.$store.commit("updateBpm", this.validValue);
    },
    onClickToggle() {
      // TODO: do not use emit, use vuex
      this.$emit("toggle");
    },
  },
  mouted() {
    this.value = this.initialValue
  },
}
</script>
