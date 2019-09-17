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
      <div class="row" style="height: 19%">
        <a class="col-4 tenkey-key" href="#" name="numkey" value="7">7</a>
        <a class="col-4 tenkey-key" href="#" name="numkey" value="8">8</a>
        <a class="col-4 tenkey-key" href="#" name="numkey" value="9">9</a>
      </div>
      <div class="row" style="height: 19%">
        <a class="col-4 tenkey-key" href="#" name="numkey" value="4">4</a>
        <a class="col-4 tenkey-key" href="#" name="numkey" value="5">5</a>
        <a class="col-4 tenkey-key" href="#" name="numkey" value="6">6</a>
      </div>
      <div class="row" style="height: 19%">
        <a class="col-4 tenkey-key" href="#" name="numkey" value="1">1</a>
        <a class="col-4 tenkey-key" href="#" name="numkey" value="2">2</a>
        <a class="col-4 tenkey-key" href="#" name="numkey" value="3">3</a>
      </div>
      <div class="row" style="height: 19%">
        <a class="col-4 tenkey-key" href="#" name="numkey" value="0">0</a>
        <a class="col-4 tenkey-key" />
        <a id="toggle" class="col-4 tenkey-key" href="#">▶</a>
      </div>
    </div>
  </div>
</template>

<script>

class Voice {
  constructor(props) {
    this.context = props.context;
    this.frequency = props.frequency || Voice.DEFAULT_VALUES.frequency;
    this.volume = props.volume || Voice.DEFAULT_VALUES.volume;
    this.attack = props.attack || Voice.DEFAULT_VALUES.attack;
    this.release = props.release || Voice.DEFAULT_VALUES.release;
    this.isPlaying = false;
  }

  play() {
    const now = this.context.currentTime;

    this.gain = this.context.createGain();
    this.gain.gain.setValueAtTime(0, now);
    this.gain.gain.linearRampToValueAtTime(this.volume, now + this.attack);
    this.gain.connect(this.context.destination);

    this.osc = this.context.createOscillator();
    this.osc.frequency.value = this.frequency;
    this.osc.connect(this.gain);

    this.osc.start(now);

    this.gain.gain.linearRampToValueAtTime(0, now + this.attack + this.release);
    this.osc.addEventListener("ended", () => {
      this.gain.disconnect(this.context);
    });

    this.osc.stop(now + this.attack + this.release);
  }
}

Voice.DEFAULT_VALUES = {
  volume: 0.7,
  frequency: 880,
  attack: 0.005,
  release: 0.1,
};

class Light {
  constructor(canvas) {
    this.context = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.lit = false;
    this.lightAt = null;
    this.duration = 200;
  }

  tick(timestamp) {
    if (this.lit) {
      const opacity = 1.0 - (timestamp - this.lightAt) / this.duration;

      this.clear();
      this.context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.context.beginPath();
      this.context.arc(this.width / 2, this.height / 2, this.width / 2, 0, 2 * Math.PI);
      this.context.fill();
    }
  }

  on(timestamp) {
    this.lightAt = timestamp;
    this.lit = true;
  }

  off() {
    this.lightAt = null;
    this.lit = false;
    this.clear();
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

class LightScheduler {
  constructor(light) {
    this.light = light;
    this.nextLightingTime = 0;
  }

  tick(timestamp, nextLightingTime) {
    if (nextLightingTime) {
      this.nextLightingTime = nextLightingTime;
    }

    if (this.nextLightingTime <= timestamp && timestamp <= this.nextLightingTime + this.light.duration) {
      if (!this.light.lit) {
        this.light.on(timestamp);
      }
    } else if (this.light.lit) {
      this.light.off();
    }
    this.light.tick(timestamp);
  }
}

class ClickScheduler {
  constructor(options) {
    this.context = options.context;
    this._bpm = options.bpm;
    this.nextNoteTime = 0;
    this.voice = new Voice({ context: this.context });
  }

  // frameTime は requestAnimationFrame から渡される値で millisecond (double)
  enqueue(frameTime) {
    // 25ms 以内に次の音を鳴らすべきなら enqueue
    const untilNextNote = this.nextNoteTime - this.context.currentTime; // in seconds (double)
    if (untilNextNote > 0.025) { return; }

    this.voice.play(this.nextNoteTime);
    this.nextNoteTime += this.secondsPerBeat;
    // indicator を表示すべき時間を返す
    return frameTime + (untilNextNote * 1000);
  };

  clickNow() {
    this.nextNoteTime = this.context.currentTime;
    // Safari では touchstart イベントで同期的にサウンドを再生しないと AudioCocontext.state が suspended になり、AudioContext.currentTime が 0 になるので、volume 0 で再生
    // https://qiita.com/pentamania/items/2c568a9ec52148bbfd08
    const v = new Voice({ context: this.context, volume: 0 });
    v.play(this.nextNoteTime);
  }

  set bpm(v) {
    this.secondsPerBeat = 60 / v;
    this._bpm = v;
  }

  get bpm() {
    return this._bpm;
  }
}

class TenKey {
  constructor(el, { store, value }) {
    this.el = el;
    this.value = value;
    this.store = store;
    el.querySelectorAll("[name=numkey]").forEach((numkey) => {
      numkey.addEventListener("touchstart", this.onClickNumkey.bind(this));
    });
  }

  onClickNumkey(e) {
    const i = window.parseInt(e.target.textContent, 10);
    this.value = (this.value * 10 + i) % 1000;

    this.store.commit("updateDisplayBpm", this.value);
    this.store.commit("updateBpm", this.validValue);
  }

  get validValue() {
    if (this.value > 250) {
      return 250;
    }

    if (this.value < 20) {
      return 20;
    }

    return this.value;
  }
}

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

    const tenkey = new TenKey(document.querySelector("#tenkey"), { store, value: store.state.displayBpm });
    store.subscribe(() => {
      tenkey.value = store.state.displayBpm;
    });

    store.subscribe(() => {
      let s = store.state.displayBpm.toString();
      while (s.length < 3) {
        s = "0" + s;
      }
      document.querySelector("[name=bpm]").value = s;
    });

    document.querySelector("#toggle").addEventListener("touchstart", this.toggle.bind(this));
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
  mounted() {
    this.app = new App(this.$store);
  },
}
</script>

<style>
</style>
