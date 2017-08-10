// Objects.
let Map = undefined;
let Nini = undefined;
let Camera = undefined;

// Images.
let atlas = undefined;
let arrow = undefined;

// Fonts.
let font = undefined;

// Sounds.
let meow = undefined;
let annoying = undefined;
let kitten_meow = undefined;

// Miscellaneous.

let kittens = [];

let kittens_found = 0;

let points = 0;

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

const TILE_SIZE = 64;

const CANVAS_W = 768;
const CANVAS_H = 448;

const NUMBER_OF_TILES_X = 12 * 16;
const NUMBER_OF_TILES_Y = 6 * 6;

function getRandomNumber() {

  return Math.floor(Math.random() * 100);
}
