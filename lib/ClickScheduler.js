import Voice from "~/lib/Voice";

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

export default ClickScheduler;
