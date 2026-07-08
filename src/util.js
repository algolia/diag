// Minimal browser-friendly replacement for Node's `util.format`.
// The codebase only relies on the `%s`/`%d`/`%j`/`%%` specifiers.
export function format(f) {
  const args = Array.prototype.slice.call(arguments, 1);

  if (typeof f !== 'string') {
    return [f].concat(args).map(String).join(' ');
  }

  let i = 0;
  let str = f.replace(/%[sdj%]/g, function(match) {
    if (match === '%%') return '%';
    if (i >= args.length) return match;
    switch (match) {
      case '%s': return String(args[i++]);
      case '%d': return String(Number(args[i++]));
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (e) {
          return '[Circular]';
        }
      default: return match;
    }
  });

  for (; i < args.length; i++) {
    str += ' ' + String(args[i]);
  }

  return str;
}
