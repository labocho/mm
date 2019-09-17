class Light {
  public lit: boolean;
  public duration: number;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private lightAt: number | null;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (context === null) {
      throw "Cannot get canvas context";
    }
    this.context = context;
    this.width = canvas.width;
    this.height = canvas.height;
    this.lit = false;
    this.lightAt = null;
    this.duration = 200;
  }

  tick(timestamp: number): void {
    if (this.lit && this.lightAt) {
      const opacity = 1.0 - (timestamp - this.lightAt) / this.duration;

      this.clear();
      this.context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.context.beginPath();
      this.context.arc(this.width / 2, this.height / 2, this.width / 2, 0, 2 * Math.PI);
      this.context.fill();
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
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

export default Light;
