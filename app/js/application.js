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
    }

    on() {
      this.lit = true;
      this.clear();
      this.context.fillStyle = "#000";
      this.context.beginPath();
      this.context.arc(50, 50, 10, 0, 2 * Math.PI);
      this.context.fill();
    }

    off() {
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

      if (this.nextLightingTime <= timestamp && timestamp <= this.nextLightingTime + 200) {
        if (!this.light.lit) {
          light.on();
        }
      } else {
        if (this.light.lit) {
          this.light.off();
        }
      }
    }
  }

  const context = new (window["AudioContext"] || window["webkitAudioContext"])();
  const bpm = 60;
  const queue = [];
  let nextNoteTime = 0;
  let secondsPerBeat = 60 / bpm;

  // frameTime は requestAnimationFrame から渡される値で millisecond (double)
  const enqueue = function(frameTime) {
    // 25ms 以内に次の音を鳴らすべきなら enqueue
    const untilNextNote = nextNoteTime - context.currentTime; // in seconds (double)
    if (untilNextNote > 0.025) { return; }

    const v = new Voice({context: context});
    v.play(nextNoteTime);
    nextNoteTime += secondsPerBeat;
    // indicator を表示すべき時間を返す
    return frameTime + (untilNextNote * 1000);
  };

  let running = false;
  document.querySelector("#toggle").addEventListener("click", function() {
    if (running) {
      running = false;
    } else {
      running = true;
      window.requestAnimationFrame(frame);
      nextNoteTime = context.currentTime;
    }
  });

  const light = new Light(document.querySelector("#light"));
  const lightScheduler = new LightScheduler(light);

  const frame = function(timestamp) {
    if (!running) { return; }

    const r = enqueue(timestamp);
    lightScheduler.tick(timestamp, r);
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);

  window.context = context;

}());
