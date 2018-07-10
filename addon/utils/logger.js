export default function logger(type = 'log', ...args) {
  window[`console`][type].apply(null, args);
  return window[`console`];
}
