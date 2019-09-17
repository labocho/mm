const DEFAULT_VALUES = {
  volume: 0.7,
  frequency: 880,
  attack: 0.005,
  release: 0.1,
};

class Voice {
  private context: AudioContext;
  private frequency: number;
  private volume: number;
  private attack: number;
  private release: number;
  private isPlaying: boolean;
  private gain: GainNode | null;
  private osc: OscillatorNode | null;

  constructor({ context, frequency, volume, attack, release }: { context: AudioContext, frequency?: number, volume?: number, attack?: number, release?: number }) {
    this.context = context;
    this.frequency = frequency || DEFAULT_VALUES.frequency;
    this.volume = volume || DEFAULT_VALUES.volume;
    this.attack = attack || DEFAULT_VALUES.attack;
    this.release = release || DEFAULT_VALUES.release;
    this.isPlaying = false;
    this.gain = null;
    this.osc = null;
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
      (<GainNode>this.gain).disconnect(this.context.destination);
    });

    this.osc.stop(now + this.attack + this.release);
  }
}


export default Voice;
