
const control = {
  direction: false,
  lastKey: false,
  maxDistance: 40,
  deadzone: 8,
  contDir: 0,
  // location from which drag begins, used to calculate offsets
  dragStart: null,
  // track touch identifier in case multiple joysticks present
  touchId: null,
  active: false,
  value: {
    x: 0,
    y: 0
  },
}
