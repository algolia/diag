type Attrs = Record<string, string | number | boolean | null | undefined>;
type Child = Node | string | null | undefined | false;

/**
 * Create an element with attributes and children.
 *
 * String children are appended as text nodes, so any dynamic value is escaped
 * by construction — there is no HTML string to parse, which is what makes this
 * safe to use with untrusted data (unlike `innerHTML`).
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    node.setAttribute(key, value === true ? '' : String(value));
  }

  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child);
  }

  return node;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Build an SVG element (with child shapes) via the DOM rather than an HTML
 * string, so icons don't require `innerHTML` either.
 */
export function svg(
  attrs: Record<string, string>,
  shapes: Array<[tag: string, attrs: Record<string, string>]>,
): SVGElement {
  const root = document.createElementNS(SVG_NS, 'svg');
  for (const [key, value] of Object.entries(attrs)) {
    root.setAttribute(key, value);
  }
  for (const [tag, shapeAttrs] of shapes) {
    const shape = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(shapeAttrs)) {
      shape.setAttribute(key, value);
    }
    root.appendChild(shape);
  }
  return root;
}
