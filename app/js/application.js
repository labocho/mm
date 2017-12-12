(function() {
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
      this.osc.addEventListener("ended", ()=> {
        this.gain.disconnect(this.context);
      });

      this.osc.stop(now + this.attack + this.release);
    }
  }

  Voice.DEFAULT_VALUES = {
    volume: 0.7,
    frequency: 880,
    attack: 0.01,
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
        this.context.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        this.context.beginPath();
        this.context.arc(50, 50, 10, 0, 2 * Math.PI);
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
      this.context.fillStyle = "#fff";
      this.context.fillRect(0, 0, this.width, this.height);
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
      } else {
        if (this.light.lit) {
          this.light.off();
        }
      }
      this.light.tick(timestamp);
    }
  }

  class ClickScheduler {
    constructor(options) {
      this.context = options.context;
      this._bpm = options.bpm;
      this.nextNoteTime = 0;
    }

    // frameTime は requestAnimationFrame から渡される値で millisecond (double)
    enqueue(frameTime) {
      // 25ms 以内に次の音を鳴らすべきなら enqueue
      const untilNextNote = this.nextNoteTime - this.context.currentTime; // in seconds (double)
      if (untilNextNote > 0.025) { return; }

      const v = new Voice({context: this.context});
      v.play(this.nextNoteTime);
      this.nextNoteTime += this.secondsPerBeat;
      // indicator を表示すべき時間を返す
      return frameTime + (untilNextNote * 1000);
    };

    clickNow() {
      this.nextNoteTime = this.context.currentTime;
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
    constructor(el, options) {
      this.el = el;
      this.value = options.value;
      el.querySelectorAll("[name=numkey]").forEach((numkey) => {
        numkey.addEventListener("click", this.onClickNumkey.bind(this));
      });
    }

    onClickNumkey(e) {
      const i = window.parseInt(e.target.value, 10);
      this.value = (this.value * 10 + i) % 1000;
      console.log(this.value);
      console.log(this.validValue);
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
    constructor() {
      const context = new (window["AudioContext"] || window["webkitAudioContext"])();
      this.clickScheduler = new ClickScheduler({context: context, bpm: this.getBpm()});

      const light = new Light(document.querySelector("#light"));
      this.lightScheduler = new LightScheduler(light);

      const tenkey = new TenKey(document.querySelector("#tenkey"), {value: this.clickScheduler.bpm});

      this.running = false;

      document.querySelector("#toggle").addEventListener("click", this.toggle.bind(this));
    }

    toggle() {
      if (this.running) {
        this.running = false;
      } else {
        this.running = true;
        this.clickScheduler.bpm = this.getBpm();
        this.clickScheduler.clickNow();
        window.requestAnimationFrame(this.tick.bind(this));
      }
    }

    tick(timestamp) {
      let r = null;
      if (this.running) {
        r = this.clickScheduler.enqueue(timestamp);
      }
      this.lightScheduler.tick(timestamp, r);
      window.requestAnimationFrame(this.tick.bind(this));
    }

    getBpm() {
      const i = window.parseInt(document.querySelector("[name=bpm]").value);
      if (isNaN(i) || i < 1) {
        return 60;
      }
      return i;
    }
  }

  new App();
}());
