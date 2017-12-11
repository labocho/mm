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

  var context = new (window["AudioContext"] || window["webkitAudioContext"])();
  var bpm = 60;
  var queue = [];
  var nextNoteTime = 0;
  var secondsPerBeat = 60 / bpm;

  // frameTime は requestAnimationFrame から渡される値で millisecond (double)
  var enqueue = function enqueue(frameTime) {
    // 25ms 以内に次の音を鳴らすべきなら enqueue
    var untilNextNote = nextNoteTime - context.currentTime; // in seconds (double)
    if (untilNextNote > 0.025) {
      return;
    }

    var v = new Voice({ context: context });
    v.play(nextNoteTime);
    nextNoteTime += secondsPerBeat;
    // indicator を表示すべき時間を返す
    return frameTime + untilNextNote * 1000;
  };

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

  var nextLightingTime = 0;
  var lighting = false;

  var switchLight = function switchLight(timestamp, enqueueResult) {
    if (enqueueResult) {
      nextLightingTime = enqueueResult;
    }

    if (nextLightingTime <= timestamp && timestamp <= nextLightingTime + 200) {
      if (!lighting) {
        console.log("light on");
        lighting = true;
      }
    } else {
      if (lighting) {
        console.log("light off");
        lighting = false;
      }
    }
  };

  var frame = function frame(timestamp) {
    if (!running) {
      return;
    }

    var r = enqueue(timestamp);
    switchLight(timestamp, r);
    window.requestAnimationFrame(frame);
  };

  window.requestAnimationFrame(frame);

  window.context = context;
})();
