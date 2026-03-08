export function linear(t) {
  return t;
}

export function easeIn(t) {
  return t * t * t;
}

export function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOut(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function easeOutBounce(t) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

export function easeOutElastic(t) {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

export const EASING_FUNCTIONS = {
  linear: { fn: linear, label: 'Linear' },
  easeIn: { fn: easeIn, label: 'Ease In' },
  easeOut: { fn: easeOut, label: 'Ease Out' },
  easeInOut: { fn: easeInOut, label: 'Ease In-Out' },
  easeOutBack: { fn: easeOutBack, label: 'Overshoot' },
  easeOutBounce: { fn: easeOutBounce, label: 'Bounce' },
  easeOutElastic: { fn: easeOutElastic, label: 'Elastic' },
};
