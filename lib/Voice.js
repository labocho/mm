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

export default Voice;
