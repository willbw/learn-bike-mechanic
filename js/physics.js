/* Drivetrain physics shared by the clutch/gearbox lab and the ride.
   Engine -> clutch (slip/lock model) -> gearbox -> final drive -> wheel. */

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const RAD2RPM = 60 / (2 * Math.PI);

const BIKE = {
  primary: 3.0,
  ratios: [2.6, 1.9, 1.5, 1.25, 1.05],
  frontTeeth: 13, rearTeeth: 48,
  wheelR: 0.33,
  mass: 185,           // bike + rider, kg
  Ie: 0.025,           // crank + flywheel inertia, kg m^2
  Tmax: 30,            // peak combustion torque, Nm
  clutchCap: 90,       // clutch torque capacity fully engaged, Nm
  idle: 2000, limiter: 12000, stallRpm: 900,
  CdA: 0.6, brakeMax: 1.0 * 185 * 9.81,
  heatK: 0.0011
};
BIKE.final = BIKE.rearTeeth / BIKE.frontTeeth;

/* Normalised torque curve: soft at low rpm, peak ~8500, falling to the limiter. */
function torqueCurve(rpm) {
  if (rpm <= 8500) return 0.4 + 0.6 * Math.sin(clamp(rpm / 8500, 0, 1) * Math.PI / 2);
  return Math.max(0, 1 - Math.pow((rpm - 8500) / 4000, 2) * 0.4);
}

// Gear positions in shift order. Index into this with `pos`.
const GEAR_ORDER = [1, 0, 2, 3, 4, 5]; // 1-N-2-3-4-5

class Drivetrain {
  constructor(params = {}) {
    this.P = Object.assign({}, BIKE, params);
    this.reset();
  }
  reset() {
    this.we = 0; this.v = 0; this.pos = 1; this.running = false;
    this.clutchHeat = 0; this.stalls = 0; this.limiting = false; this.slipping = false;
    this.wheelAngle = 0; this.crankAngle = 0; this.events = [];
    this.clutchTorque = 0; this.engineTorque = 0; this.locked = false;
  }
  get gear() { return GEAR_ORDER[this.pos]; }
  get gearLabel() { return this.gear === 0 ? 'N' : String(this.gear); }
  get rpm() { return this.we * RAD2RPM; }
  get kmh() { return this.v * 3.6; }
  ratio(g = this.gear) { return g === 0 ? 0 : this.P.primary * this.P.ratios[g - 1] * this.P.final; }

  shift(dir) {
    const np = clamp(this.pos + dir, 0, GEAR_ORDER.length - 1);
    if (np === this.pos) return false;
    this.pos = np;
    return true;
  }
  emit(type, msg) { this.events.push({ type, msg }); }

  start(clutch) {
    if (this.running) return false;
    if (this.gear !== 0 && clutch < 0.8) {
      this.emit('warn', 'Starter blocked: you\'re in gear with the clutch out. Pull the clutch in or find neutral.');
      return false;
    }
    this.running = true;
    this.we = Math.max(this.we, 1500 / RAD2RPM);
    this.emit('info', 'Engine started.');
    return true;
  }
  kill() {
    if (this.running) { this.running = false; this.emit('info', 'Engine off (kill switch).'); }
  }

  /* inp: {throttle 0..1, clutch 0..1 (1 = lever fully pulled), brake 0..1,
           slope radians (+ uphill), crr rolling resistance} */
  step(dt, inp) {
    const P = this.P;
    const rpm = this.rpm;
    let Te;
    this.limiting = false;
    if (this.running) {
      // Progressive throttle feel, and an idle circuit that holds ~idle rpm.
      const th = 1 - Math.pow(1 - clamp(inp.throttle || 0, 0, 1), 2);
      let comb = th * P.Tmax * torqueCurve(rpm) + clamp((P.idle - rpm) * 0.01, 0, 5);
      if (rpm > P.limiter) { comb = 0; this.limiting = true; }
      Te = comb - (1.2 + rpm * 0.0003 + (1 - th) * rpm * 0.0012);
    } else {
      Te = this.we > 0.01 ? -(4 + rpm * 0.0006) : 0;
    }
    this.engineTorque = Te;

    const lever = clamp(inp.clutch || 0, 0, 1);
    const eng = clamp((0.85 - lever) / 0.7, 0, 1);
    const fade = 1 - clamp((this.clutchHeat - 70) / 60, 0, 0.6);
    const Tcap = this.gear === 0 ? 0 : P.clutchCap * eng * eng * fade;

    const m = P.mass, R = P.wheelR, g = 9.81;
    const slope = inp.slope || 0;
    const crr = inp.crr == null ? 0.03 : inp.crr;
    const v = this.v;
    const Fres = m * g * Math.sin(slope) + 0.5 * 1.2 * P.CdA * v * Math.abs(v);

    let locked = false;
    this.clutchTorque = 0;
    if (Tcap <= 0) {
      this.we += Te / P.Ie * dt;
      this.v += -Fres / m * dt;
    } else {
      const G = this.ratio();
      const Ib = m * R * R / (G * G);
      const wb = v / R * G;
      const Tl = Fres * R / G;
      const diff = this.we - wb;
      if (Math.abs(diff) < 0.5) {
        const a = (Te - Tl) / (P.Ie + Ib);
        const Treq = Te - P.Ie * a;
        if (Math.abs(Treq) <= Tcap) {
          locked = true;
          const w = (P.Ie * this.we + Ib * wb) / (P.Ie + Ib) + a * dt;
          this.we = w; this.v = w * R / G;
          this.clutchTorque = Treq;
        }
      }
      if (!locked) {
        const s = Math.sign(diff) || Math.sign(Te - Tl) || 1;
        const Tc = Tcap * s;
        this.we += (Te - Tc) / P.Ie * dt;
        this.v += (Tc * G / R - Fres) / m * dt;
        this.clutchTorque = Tc;
        this.clutchHeat += Math.abs(Tc * diff) * dt * P.heatK;
        const nd = this.we - this.v / R * G;
        if (Math.sign(nd) !== Math.sign(diff) && diff !== 0) {
          const w = (P.Ie * this.we + Ib * this.v / R * G) / (P.Ie + Ib);
          this.we = w; this.v = w * R / G;
        }
      }
    }

    // Rolling resistance and brakes act like friction: they can stop the
    // bike but never push it backwards.
    const Fstop = crr * m * g * Math.cos(slope) + clamp(inp.brake || 0, 0, 1) * P.brakeMax;
    const dv = Fstop / m * dt;
    if (Math.abs(this.v) <= dv) this.v = 0; else this.v -= Math.sign(this.v) * dv;
    if (locked) this.we = this.v / R * this.ratio();

    if (this.we < 0) { this.we = 0; if (locked) this.v = 0; }
    if (!this.running && this.we < 0.5 && Tcap <= 0) this.we = Math.max(0, this.we);

    this.locked = locked;
    this.slipping = Tcap > 0 && !locked;
    this.clutchHeat = Math.max(0, this.clutchHeat - this.clutchHeat * 0.12 * dt);

    if (this.running && this.rpm < P.stallRpm) {
      this.running = false; this.stalls++;
      this.emit('stall', 'Stalled! The engine was dragged below idle. Pull the clutch in, then press start.');
    }

    this.wheelAngle += this.v / R * dt;
    this.crankAngle += this.we * dt;
  }
}
