class LightScheduler {
  constructor(light) {
    this.light = light;
    this.nextLightingTime = 0;
  }

  tick(timestamp, nextLightingTime) {
    if (nextLightingTime) {
      this.nextLightingTime = nextLightingTime;
    }

    if (this.nextLightingTime <= timestamp && timestamp <= this.nextLightingTime + this.light.duration) {
      if (!this.light.lit) {
        this.light.on(timestamp);
      }
    } else if (this.light.lit) {
      this.light.off();
    }
    this.light.tick(timestamp);
  }
}

export default LightScheduler;
