import { svg } from './dom';

// Small feather-style icons built as real SVG elements (no innerHTML), sized in
// `em` and inheriting color via `currentColor` so they match surrounding text.
const BASE = {
  class: 'icon',
  viewBox: '0 0 24 24',
  width: '1em',
  height: '1em',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
};

export const flashIcon = (): SVGElement =>
  svg(BASE, [
    ['polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' }],
  ]);

export const sendIcon = (): SVGElement =>
  svg(BASE, [
    ['line', { x1: '22', y1: '2', x2: '11', y2: '13' }],
    ['polygon', { points: '22 2 15 22 11 13 2 9 22 2' }],
  ]);

export const copyIcon = (): SVGElement =>
  svg(BASE, [
    ['rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }],
    [
      'path',
      { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' },
    ],
  ]);

export const chevronIcon = (): SVGElement =>
  svg(BASE, [['polyline', { points: '6 9 12 15 18 9' }]]);

export const spinnerIcon = (): SVGElement =>
  svg({ ...BASE, class: 'icon spinner', 'stroke-width': '2.5' }, [
    ['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56', opacity: '0.9' }],
  ]);
