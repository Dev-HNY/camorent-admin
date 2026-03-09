// Polyfill setImmediate/clearImmediate — missing in New Architecture / bridgeless mode
// (Expo Go forces New Arch; RN 0.77 StatusBar uses these internally)
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
if (typeof global.clearImmediate === 'undefined') {
  global.clearImmediate = (id) => clearTimeout(id);
}

require('expo/AppEntry');
