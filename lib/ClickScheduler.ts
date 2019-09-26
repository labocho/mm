import Voice from "~/lib/Voice";

class ClickScheduler {
  public context: AudioContext;
  private secondsPerBeat: number;
  private nextNoteTime: number;
  private voice: Voice;
  private _bpm: number;

  constructor({ context, bpm }: { context: AudioContext, bpm: number }) {
    this.context = context;
    this._bpm = bpm;
    this.secondsPerBeat = 60 / bpm;
    this.nextNoteTime = 0;
    this.voice = new Voice({ context: this.context });
  }

  // frameTime は requestAnimationFrame から渡される値で millisecond (double)
  enqueue(frameTime: number): number | null {
    // Safari を閉じたときにこの state になり、currentTime が更新されなくなるのを防ぐ
    if (this.context.state === <AudioContextState>"interrupted") {
      this.context.resume();
    }

    // 25ms 以内に次の音を鳴らすべきなら enqueue
    const untilNextNote: number = this.nextNoteTime - this.context.currentTime; // in seconds (double)
    if (untilNextNote > 0.025) { return null; }

    this.voice.play();
    this.nextNoteTime += this.secondsPerBeat;
    // indicator を表示すべき時間を返す
    return frameTime + (untilNextNote * 1000);
  };

  clickNow(): void {
    this.nextNoteTime = this.context.currentTime;
    // Safari では touchstart イベントで同期的にサウンドを再生しないと AudioCocontext.state が suspended になり、AudioContext.currentTime が 0 になるので、volume 0 で再生
    // https://qiita.com/pentamania/items/2c568a9ec52148bbfd08
    const v = new Voice({ context: this.context, volume: 0.0001 });
    v.play();
  }

  set bpm(v: number) {
    this.secondsPerBeat = 60 / v;
    this._bpm = v;
  }

  get bpm(): number {
    return this._bpm;
  }
}

export default ClickScheduler;
