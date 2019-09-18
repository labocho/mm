class Light {
  public lit: boolean;
  public duration: number;
  private el: HTMLElement;
  private lightAt: number | null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.lit = false;
    this.lightAt = null;
    this.duration = 200;
  }

  tick(timestamp: number): void {
    if (this.lit && this.lightAt) {
      const opacity = 1.0 - (timestamp - this.lightAt) / this.duration;
      if (opacity < 0.8) {
        // debugger
      }
      this.el.style.opacity = opacity.toString();
    }
  }

  on(timestamp: number): void {
    this.lightAt = timestamp;
    this.lit = true;
  }

  off(): void {
    this.lightAt = null;
    this.lit = false;
    this.clear();
  }

  clear(): void {
    this.el.style.opacity = "0";
  }
}

export default Light;
