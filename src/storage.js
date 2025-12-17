const KEY = "daddy-points-phase1";

export function loadState() {
  return JSON.parse(localStorage.getItem(KEY)) || {
    points: { Leo: 0, Tyler: 0, Ryker: 0 },
    tasks: {},
  };
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
