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
      this.context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.context.beginPath();
      this.context.arc(this.width / 2, this.height / 2, this.width / 2, 0, 2 * Math.PI);
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
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

export default Light;
