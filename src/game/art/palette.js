import { mat } from './pixel';

// Daytime park palette: bright, saturated greens and sand, in the spirit of
// cozy top-down farming and monster-collecting RPGs (original colors).
export const P = {
  grass: '#62b04a',
  grassDark: '#4e9a3c',
  grassLight: '#7ec65a',
  blade: '#3f8434',
  flowers: ['#fff7e8', '#ffd54a', '#ff8fb1', '#9ad7ff'],

  sand: '#e2c387',
  sandDark: '#c9a467',
  sandEdge: '#a98250',
  pebble: '#b8925c',

  water: '#3f94dc',
  waterDeep: '#347fc8',
  waterLight: '#8fd3f7',
  foam: '#e6f6ff',

  wood: '#b37a45',
  woodDark: '#86562f',
  woodLight: '#d39a5c',

  outline: '#2b2236',
  shadow: 'rgba(32, 36, 54, 0.28)',
};

export const M = {
  leaf: mat('#3f9a3e', '#62bd52', '#2c7432'),
  leafAlt: mat('#4aa84a', '#72c95c', '#337d35'),
  trunk: mat('#8a5a33', '#a8703f', '#6a4325'),
  wood: mat(P.wood, P.woodLight, P.woodDark),
  stone: mat('#9aa3ad', '#c3cad1', '#737d88'),
  roofBlue: mat('#3a63b0', '#5a86d0', '#2a4888'),
  roofRed: mat('#c0533f', '#de7a5c', '#94392c'),
  roofGreen: mat('#3f8f6a', '#5fb487', '#2d6c4f'),
  wall: mat('#f4e6c8', '#fff6e2', '#dcc9a3'),
  glass: mat('#8fd0f2', '#d6f1ff', '#5ea9d6'),
  door: mat('#9a6236', '#b97d48', '#744620'),
  board: mat('#f6ecd2', '#fffaf0', '#d9c9a4'),
};
