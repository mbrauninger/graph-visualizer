export const NODE_RADIUS = 17;
export const WEIGHT_RADIUS = 10;
export const DEFAULT_NUM_NODES = 120;
export const CANVAS_WIDTH_PERCENTAGE = window.innerWidth <= 768 ? 91.5 : 56;
export const CANVAS_HEIGHT_PERCENTAGE = window.innerWidth <= 768 ? 70 : 80;
export const DISPLAY_WIDTH =
  (window.innerWidth * CANVAS_WIDTH_PERCENTAGE) / 100;
export const DISPLAY_HEIGHT =
  (window.innerHeight * CANVAS_HEIGHT_PERCENTAGE) / 100;
export const FAST_DELAY = 50;
export const MEDIUM_DELAY = 100;
export const SLOW_DELAY = 1000;
export const MAX_LISTED_TRAVERSAL_ITEMS = 30;
export const GRAPH_SIZE = 38;
export const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
export const LESS_X_OFFSET = new Set(["W"]);
export const MORE_X_OFFSET = new Set([
  "F",
  "I",
  "L",
  "J",
  "P",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "i",
  "j",
  "l",
]);
export const MORE_HEURISTIC_X_OFFSET = new Set([
  "G",
  "M",
  "O",
  "Q",
  "a",
  "b",
  "d",
  "e",
]);
export const LESS_HEURISTIC_X_OFFSET = new Set([
  "I",
  "T",
  "V",
  "Y",
  "f",
  "g",
  "i",
  "j",
  "k",
  "l",
]);
