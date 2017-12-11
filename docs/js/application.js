"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var Voice = function () {
    function Voice(props) {
      _classCallCheck(this, Voice);

      this.context = props.context;
      this.frequency = props.frequency || Voice.DEFAULT_VALUES.frequency;
      this.volume = props.volume || Voice.DEFAULT_VALUES.volume;
      this.attack = props.attack || Voice.DEFAULT_VALUES.attack;
      this.release = props.release || Voice.DEFAULT_VALUES.release;
      this.isPlaying = false;
    }

    _createClass(Voice, [{
      key: "play",
      value: function play() {
        var _this = this;

        var now = this.context.currentTime;

        this.gain = this.context.createGain();
        this.gain.gain.setValueAtTime(0, now);
        this.gain.gain.linearRampToValueAtTime(this.volume, now + this.attack);
        this.gain.connect(this.context.destination);

        this.osc = this.context.createOscillator();
        this.osc.frequency.value = this.frequency;
        this.osc.connect(this.gain);

        this.osc.start(now);

        this.gain.gain.linearRampToValueAtTime(0, now + this.attack + this.release);
        this.osc.addEventListener("ended", function () {
          _this.gain.disconnect(_this.context);
        });

        this.osc.stop(now + this.attack + this.release);
      }
    }]);

    return Voice;
  }();

  Voice.DEFAULT_VALUES = {
    volume: 0.7,
    frequency: 880,
    attack: 0.01,
    release: 0.1
  };

  var Light = function () {
    function Light(canvas) {
      _classCallCheck(this, Light);

      this.context = canvas.getContext("2d");
      this.width = canvas.width;
      this.height = canvas.height;
      this.lit = false;
      this.lightAt = null;
      this.duration = 200;
    }

    _createClass(Light, [{
      key: "tick",
      value: function tick(timestamp) {
        if (this.lit) {
          var opacity = 1.0 - (timestamp - this.lightAt) / this.duration;

          this.clear();
          this.context.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
          this.context.beginPath();
          this.context.arc(50, 50, 10, 0, 2 * Math.PI);
          this.context.fill();
        }
      }
    }, {
      key: "on",
      value: function on(timestamp) {
        this.lightAt = timestamp;
        this.lit = true;
      }
    }, {
      key: "off",
      value: function off() {
        this.lightAt = null;
        this.lit = false;
        this.clear();
      }
    }, {
      key: "clear",
      value: function clear() {
        this.context.fillStyle = "#fff";
        this.context.fillRect(0, 0, this.width, this.height);
      }
    }]);

    return Light;
  }();

  var LightScheduler = function () {
    function LightScheduler(light) {
      _classCallCheck(this, LightScheduler);

      this.light = light;
      this.nextLightingTime = 0;
    }

    _createClass(LightScheduler, [{
      key: "tick",
      value: function tick(timestamp, nextLightingTime) {
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
    }]);

    return LightScheduler;
  }();

  var ClickScheduler = function () {
    function ClickScheduler(options) {
      _classCallCheck(this, ClickScheduler);

      this.context = options.context;
      this.bpm = options.bpm;
      this.nextNoteTime = 0;
      this.secondsPerBeat = 60 / this.bpm;
    }

    // frameTime は requestAnimationFrame から渡される値で millisecond (double)


    _createClass(ClickScheduler, [{
      key: "enqueue",
      value: function enqueue(frameTime) {
        // 25ms 以内に次の音を鳴らすべきなら enqueue
        var untilNextNote = this.nextNoteTime - this.context.currentTime; // in seconds (double)
        if (untilNextNote > 0.025) {
          return;
        }

        var v = new Voice({ context: this.context });
        v.play(this.nextNoteTime);
        this.nextNoteTime += this.secondsPerBeat;
        // indicator を表示すべき時間を返す
        return frameTime + untilNextNote * 1000;
      }
    }]);

    return ClickScheduler;
  }();

  var context = new (window["AudioContext"] || window["webkitAudioContext"])();
  var clickScheduler = new ClickScheduler({ context: context, bpm: 60 });

  var running = false;
  document.querySelector("#toggle").addEventListener("click", function () {
    if (running) {
      running = false;
    } else {
      running = true;
      window.requestAnimationFrame(frame);
      nextNoteTime = context.currentTime;
    }
  });

  var light = new Light(document.querySelector("#light"));
  var lightScheduler = new LightScheduler(light);

  var frame = function frame(timestamp) {
    if (!running) {
      return;
    }

    var r = clickScheduler.enqueue(timestamp);
    lightScheduler.tick(timestamp, r);
    window.requestAnimationFrame(frame);
  };

  window.requestAnimationFrame(frame);

  window.context = context;
})();
