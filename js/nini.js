Nini = new class {

  constructor() {

    this.x = 256;
    this.y = 256 * 4;

    this.speed = 4;

    this.facing = getRandomNumber() % 2;

    this.moving = false;

    this.move = [false, false, false, false];

    this.start_tile = -1;
    this.stop_tile = -1;

    this.animation_ticks = 0;
    this.animation_frames = 0;

    this.meow_ticks = 0;

    this.wait_ticks = 0;

    this.meow = false;

    this.meow_range = 1;
  }

  update() {

    // Get Nini's position on the tile grid.
    let tile_x = (this.x / TILE_SIZE) | 0;
    let tile_y = (this.y / TILE_SIZE) | 0;

    ++this.wait_ticks;

    if (Momo.isKeyPressed("z")) {

      if (this.wait_ticks > 15) {

        this.wait_ticks = 0;

        Momo.playSound(meow, 1.0, 1.0, false);

        this.meow = true;

        this.doAction(tile_x, tile_y);
      }
    }

    if (!this.moving) {

      if (Momo.isKeyDown("up")) {

        if (Map.getTileFlag(tile_x, tile_y - 1) === "f") {

          this.move[UP] = true;
        }
      }
      else if (Momo.isKeyDown("down")) {

        if (Map.getTileFlag(tile_x, tile_y + 1) === "f") {

          this.move[DOWN] = true;
        }
      }
      else if (Momo.isKeyDown("left")) {

        this.facing = 0;

        if (Map.getTileFlag(tile_x - 1, tile_y) === "f") {

          this.move[LEFT] = true;
        }
      }
      else if (Momo.isKeyDown("right")) {

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

    if (Map.getTile(tile_x, tile_y) === "04x02") {

      // Nini collected a bowl of ramen noodles.

      // Convert the tile to grass.
      Map.setTile(tile_x, tile_y, "00x02f");

      if (this.speed < 6) {

        // Increase Nini's speed.
        ++this.speed;
      }

      points += 100;

      Momo.playSound(kitten_meow, 1.0, 1.0, false);

      if (this.meow_range < 3) {

        ++this.meow_range;
      }
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

    if (this.meow) {

      // Draw Nini with a slight tint.

      ++this.meow_ticks;

      if (this.meow_ticks === 10) {

        this.meow_ticks = 0;

        this.meow = false;
      }

      Momo.drawPartialImage(

        atlas,

        TILE_SIZE * 4 + (TILE_SIZE * this.facing),

        TILE_SIZE * this.animation_frames,

        TILE_SIZE,

        TILE_SIZE,

        this.x - Camera.getX(),

        this.y - Camera.getY()
      );
    }
    else {

      // Draw Nini normally.

      Momo.drawPartialImage(

        atlas,

        TILE_SIZE * this.facing,

        TILE_SIZE * this.animation_frames,

        TILE_SIZE,

        TILE_SIZE,

        this.x - Camera.getX(),

        this.y - Camera.getY()
      );
    }
  }

  getX() {

    return this.x;
  }

  getY() {

    return this.y;
  }

  spawn() {

    // Select a random tile to spawn in.
    let spawn_x = getRandomNumber() % NUMBER_OF_TILES_X;
    let spawn_y = getRandomNumber() % NUMBER_OF_TILES_Y;

    if (spawn_x < 1 || spawn_y < 1 || spawn_x > NUMBER_OF_TILES_X - 1 || spawn_y > NUMBER_OF_TILES_Y - 1) {

      // Nini spawned out of bounds; try again.
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

  doAction(tile_x, tile_y) {

    let multiplier = 0;
    let points_to_add = 0;

    let i = 0;

    let tile_grid_x = (this.x / TILE_SIZE) | 0;
    let tile_grid_y = (this.y / TILE_SIZE) | 0;

    for (i; i < this.meow_range + 1; ++i) {

      if (tile_x + i > 0) {

        let j = 0;

        for (j; j < kittens.length; ++j) {

          if (kittens[j].hasReturnedToMama()) {

            continue;
          }

          if (kittens[j].getTileX() === tile_grid_x - i && kittens[j].getTileY() === tile_grid_y) {

            ++multiplier;

            points_to_add += 250;

            kittens[j].returnToMama();

            Momo.playSound(kitten_meow, 1.0, 1.0, false);

            ++kittens_found;
          }
        }

        switch (Map.getTile(tile_x - i, tile_y)) {

          case "02x02":

            ++multiplier;

            // Destroy autumn-colored trees.
            Map.setTile(tile_x - i, tile_y, "05x02f");

            points_to_add += 5;
          break;

          case "01x02":

            ++multiplier;

            // Destroy green trees.
            Map.setTile(tile_x - i, tile_y, "05x02f");

            points_to_add += 10;
          break;

          case "03x02":

            ++multiplier;

            // Destroy mushrooms trees.
            Map.setTile(tile_x - i, tile_y, "00x03f");

            points_to_add += 15;
          break;
        }
      }

      if (tile_x + i < NUMBER_OF_TILES_X) {

        let j = 0;

        for (j; j < kittens.length; ++j) {

          if (kittens[j].hasReturnedToMama()) {

            continue;
          }

          if (kittens[j].getTileX() === tile_grid_x + i && kittens[j].getTileY() === tile_grid_y) {

            ++multiplier;

            points_to_add += 250;

            kittens[j].returnToMama();

            Momo.playSound(kitten_meow, 1.0, 1.0, false);

            ++kittens_found;
          }
        }

        switch (Map.getTile(tile_x + i, tile_y)) {

          case "02x02":

            ++multiplier;

            // Destroy autumn-colored trees.
            Map.setTile(tile_x + i, tile_y, "05x02f");

            points_to_add += 5;
          break;

          case "01x02":

            ++multiplier;

            // Destroy green trees.
            Map.setTile(tile_x + i, tile_y, "05x02f");

            points_to_add += 10;
          break;

          case "03x02":

            ++multiplier;

            // Destroy mushrooms trees.
            Map.setTile(tile_x + i, tile_y, "00x03f");

            points_to_add += 15;
          break;
        }
      }

      if (tile_y - i > 0) {

        let j = 0;

        for (j; j < kittens.length; ++j) {

          if (kittens[j].hasReturnedToMama()) {

            continue;
          }

          if (kittens[j].getTileX() === tile_grid_x && kittens[j].getTileY() === tile_grid_y - i) {

            ++multiplier;

            points_to_add += 250;

            kittens[j].returnToMama();

            Momo.playSound(kitten_meow, 1.0, 1.0, false);

            ++kittens_found;
          }
        }

        switch (Map.getTile(tile_x, tile_y - i)) {

          case "02x02":

            ++multiplier;

            // Destroy autumn-colored trees.
            Map.setTile(tile_x, tile_y - i, "05x02f");

            points_to_add += 5;
          break;

          case "01x02":

            ++multiplier;

            // Destroy green trees.
            Map.setTile(tile_x, tile_y - i, "05x02f");

            points_to_add += 10;
          break;

          case "03x02":

            ++multiplier;

            // Destroy mushrooms trees.
            Map.setTile(tile_x, tile_y - i, "00x03f");

            points_to_add += 15;
          break;
        }
      }

      if (tile_y + i < NUMBER_OF_TILES_Y) {

        let j = 0;

        for (j; j < kittens.length; ++j) {

          if (kittens[j].hasReturnedToMama()) {

            continue;
          }

          if (kittens[j].getTileX() === tile_grid_x && kittens[j].getTileY() === tile_grid_y + 1) {

            ++multiplier;

            points_to_add += 250;

            kittens[j].returnToMama();

            Momo.playSound(kitten_meow, 1.0, 1.0, false);

            ++kittens_found;
          }
        }

        switch (Map.getTile(tile_x, tile_y + i)) {

          case "02x02":

            ++multiplier;

            // Destroy autumn-colored trees.
            Map.setTile(tile_x, tile_y + i, "05x02f");

            points_to_add += 5;
          break;

          case "01x02":

            ++multiplier;

            // Destroy green trees.
            Map.setTile(tile_x, tile_y + i, "05x02f");

            points_to_add += 10;
          break;

          case "03x02":

            ++multiplier;

            // Destroy mushrooms trees.
            Map.setTile(tile_x, tile_y + i, "00x03f");

            points_to_add += 15;
          break;
        }
      }
    }

    points += points_to_add * multiplier;
  }
};
