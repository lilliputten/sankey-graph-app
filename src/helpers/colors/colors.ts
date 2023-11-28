import { TColor } from 'src/core/types';

function getColorsList(): TColor[] {
  return [
    '#2dc3d2',
    '#3483ba',
    '#40a840',
    '#556171',
    '#5c5c10',
    '#681313',
    '#6b6b45',
    '#6f3a5f',
    '#7c3e06',
    '#868686',
    '#8b8b8b',
    '#96665c',
    '#9d75c2',
    '#a1e194',
    '#a6dce6',
    '#b5cbe9',
    '#c7a39b',
    '#c9a59d',
    '#c9b7d8',
    '#cbcbcb',
    '#d93c3c',
    '#e483c7',
    '#f6bcd5',
    '#fe8b25',
    '#fea19f',
    '#fec184',
    // 'yellow',
  ];
}

export function getColorForIndex(idx: number): TColor {
  const colors = getColorsList();
  let colorIdx = idx % colors.length;
  if (colorIdx < 0) {
    colorIdx = colors.length + colorIdx;
  }
  return colors[colorIdx];
}

export function getRandomColor(): TColor {
  const colors = getColorsList();
  const maxColor = colors.length - 1;
  const randomIdx = Math.round(Math.random() * maxColor);
  return colors[randomIdx];
}

export function checkValidHexColor(color?: TColor | string) {
  // '#xxxxxx', '#xxx'
  return !!color && /^#([0-9a-f]{6}|[0-9a-f]{3})$/.test(color);
}
