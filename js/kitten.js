class Kitten {

  constructor() {

    this.x = 0;
    this.y = 0;

    this.facing = getRandomNumber() % 2;

    this.speed = 4;

    this.start_tile = -1;
    this.stop_tile = -1;

    this.moving = false;

    this.name = undefined;

    this.timer = 0;
    this.duration = 0;

    this.keys = [false, false, false, false];
    this.move = [false, false, false, false];

    this.animation_ticks = 0;
    this.animation_frames = 0;

    this.returned = false;
  }

  returnToMama() {

    this.returned = true;

    Map.setTileFlagExtra((this.x / TILE_SIZE) | 0, (this.y / TILE_SIZE) | 0, "f");

    if (((this.x / TILE_SIZE) | 0) - 1 > 0) {

      Map.setTileFlagExtra(((this.x / TILE_SIZE) | 0) - 1, (this.y / TILE_SIZE) | 0, "f");
    }

    if (((this.x / TILE_SIZE) | 0) + 1 < NUMBER_OF_TILES_X - 1) {

      Map.setTileFlagExtra(((this.x / TILE_SIZE) | 0) + 1, (this.y / TILE_SIZE) | 0, "f");
    }

    if (((this.y / TILE_SIZE) | 0) - 1 > 0) {

      Map.setTileFlagExtra((this.x / TILE_SIZE) | 0, ((this.y / TILE_SIZE) | 0) - 1, "f");
    }

    if (((this.y / TILE_SIZE) | 0) + 1 < NUMBER_OF_TILES_Y - 1) {

      Map.setTileFlagExtra((this.x / TILE_SIZE) | 0, ((this.y / TILE_SIZE) | 0) + 1, "f");
    }
  }

  hasReturnedToMama() {

    return this.returned;
  }

  update() {

    // Get the kitten's position on the tile grid.
    let tile_x = (this.x / TILE_SIZE) | 0;
    let tile_y = (this.y / TILE_SIZE) | 0;

    if (!this.moving && this.returned) {

      return;
    }

    ++this.timer;

    if (this.timer > this.duration) {

      let new_direction = getRandomNumber() % 4;

      this.timer = 0;

      this.duration = getRandomNumber() % 120;

      this.keys = [false, false, false, false];

      this.keys[new_direction] = true;
    }

    if (!this.moving) {

      if (this.keys[UP]) {

        // Attempt to move up.

        if (Map.getTileFlag(tile_x, tile_y - 1) === "f") {

          this.move[UP] = true;
        }
      }
      else if (this.keys[DOWN]) {

        // Attempt to move down.

        if (Map.getTileFlag(tile_x, tile_y + 1) === "f") {

          this.move[DOWN] = true;
        }
      }
      else if (this.keys[LEFT]) {

        // Attempt to move left.

        this.facing = 0;

        if (Map.getTileFlag(tile_x - 1, tile_y) === "f") {

          this.move[LEFT] = true;
        }
      }
      else if (this.keys[RIGHT]) {

        // Attempt to move right.

        this.facing = 1;

        if (Map.getTileFlag(tile_x + 1, tile_y) === "f") {

          this.move[RIGHT] = true;
        }
      }
    }

    if (this.moving) {

      ++this.animation_ticks;

      if (this.animation_ticks > 8) {

        this.animation_ticks = 0;

        ++this.animation_frames;

        if (this.animation_frames > 1) {

          this.animation_frames = 0;
        }
      }
    }

    if (this.move[UP]) {

      this.moveUp();
    }
    else if (this.move[DOWN]) {

      this.moveDown();
    }
    else if (this.move[LEFT]) {

      this.moveLeft();
    }
    else if (this.move[RIGHT]) {

      this.moveRight();
    }
  }

  moveUp() {

    if (!this.moving) {

      this.start_tile = (this.y / TILE_SIZE) | 0;
      this.stop_tile = this.start_tile - 1;

      this.moving = true;

      Map.setTileFlag((this.x / TILE_SIZE) | 0, this.stop_tile, "t");
      Map.setTileFlag((this.x / TILE_SIZE) | 0, this.start_tile, "t");
    }

    if (this.y > this.stop_tile * TILE_SIZE) {

      this.y -= this.speed;
    }
    else {

      this.y = this.stop_tile * TILE_SIZE;

      this.moving = false;

      this.move[UP] = false;

      Map.setTileFlag((this.x / TILE_SIZE) | 0, this.start_tile, "f");
    }
  }

  moveDown() {

    if (!this.moving) {

      this.start_tile = (this.y / TILE_SIZE) | 0;
      this.stop_tile = this.start_tile + 1;

      this.moving = true;

      Map.setTileFlag((this.x / TILE_SIZE) | 0, this.stop_tile, "t");
      Map.setTileFlag((this.x / TILE_SIZE) | 0, this.start_tile, "t");
    }

    if (this.y < this.stop_tile * TILE_SIZE) {

      this.y += this.speed;
    }
    else {

      this.y = this.stop_tile * TILE_SIZE;

      this.moving = false;

      this.move[DOWN] = false;

      Map.setTileFlag((this.x / TILE_SIZE) | 0, this.start_tile, "f");
    }
  }

  moveLeft() {

    if (!this.moving) {

      this.start_tile = (this.x / TILE_SIZE) | 0;
      this.stop_tile = this.start_tile - 1;

      this.moving = true;

      Map.setTileFlag(this.stop_tile, (this.y / TILE_SIZE) | 0, "t");
      Map.setTileFlag(this.start_tile, (this.y / TILE_SIZE) | 0, "t");
    }

    if (this.x > this.stop_tile * TILE_SIZE) {

      this.x -= this.speed;
    }
    else {

      this.x = this.stop_tile * TILE_SIZE;

      this.moving = false;

      this.move[LEFT] = false;

      Map.setTileFlag(this.start_tile, (this.y / TILE_SIZE) | 0, "f");
    }
  }

  moveRight() {

    if (!this.moving) {

      this.start_tile = (this.x / TILE_SIZE) | 0;
      this.stop_tile = this.start_tile + 1;

      this.moving = true;

      Map.setTileFlag(this.stop_tile, (this.y / TILE_SIZE) | 0, "t");
      Map.setTileFlag(this.start_tile, (this.y / TILE_SIZE) | 0, "t");
    }

    if (this.x < this.stop_tile * TILE_SIZE) {

      this.x += this.speed;
    }
    else {

      this.x = this.stop_tile * TILE_SIZE;

      this.moving = false;

      this.move[RIGHT] = false;

      Map.setTileFlag(this.start_tile, (this.y / TILE_SIZE) | 0, "f");
    }
  }

  render() {

    if (this.returned) {

      return;
    }

    if (this.x < Camera.getX() - TILE_SIZE || this.x > Camera.getX() + CANVAS_W) {

      // The kitten is outside of the camera's horizontal view; don't render.
      return;
    }

    if (this.y < Camera.getY() - TILE_SIZE || this.y > Camera.getY() + CANVAS_H) {

      // The kitten is outside of the camera's vertical view; don't render.
      return;
    }

    Momo.drawClippedBitmap(

      atlas,

      2 * TILE_SIZE + (TILE_SIZE * this.facing),

      TILE_SIZE * this.animation_frames,

      TILE_SIZE,

      TILE_SIZE,

      this.x - Camera.getX(),

      this.y - Camera.getY()
    );
  }

  spawn() {

    // Select a random tile to spawn in.
    let spawn_x = getRandomNumber() % NUMBER_OF_TILES_X;
    let spawn_y = getRandomNumber() % NUMBER_OF_TILES_Y;

    if (spawn_x < 1 || spawn_y < 1 || spawn_x > NUMBER_OF_TILES_X - 1 || spawn_y > NUMBER_OF_TILES_Y - 1) {

      // Spawned out of bounds; try again.
      this.spawn();

      return;
    }

    if (Map.getTileFlag(spawn_x, spawn_y) === "t") {

      // The tile is already occupied; try again.
      this.spawn();

      return;
    }

    // The tile is empty; spawn in it.
    this.x = spawn_x * TILE_SIZE;
    this.y = spawn_y * TILE_SIZE;

    Map.setTileFlag(spawn_x, spawn_y, "t");
  }

  setName(name) {

    this.name = name;
  }

  getName() {

    return this.name;
  }

  getX() {

    return this.x;
  }

  getY() {

    return this.y;
  }

  getTileX() {

    return (this.x / TILE_SIZE) | 0;
  }

  getTileY() {

    return (this.y / TILE_SIZE) | 0;
  }
}
