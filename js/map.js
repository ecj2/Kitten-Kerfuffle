Map = new class {

  constructor() {

    this.tiles = [];

    this.reset();
  }

  reset() {

    this.tiles = [];

    let x = 0;

    for (x; x < NUMBER_OF_TILES_X; ++x) {

      this.tiles[x] = [NUMBER_OF_TILES_Y];
    }

    let y = 0;

    for (y; y < NUMBER_OF_TILES_Y; ++y) {

      x = 0;

      for (x; x < NUMBER_OF_TILES_X; ++x) {

        // Populate the map with grass tiles.
        this.tiles[x][y] = "00x02f";

        if (x === 0 || x === NUMBER_OF_TILES_X - 1 || y === 0 || y === NUMBER_OF_TILES_Y - 1) {

          // Surround the map with a solid boundary.
          this.tiles[x][y] = "99x99t";
        }
      }
    }

    // Generate mushrooms.
    this.generateTerrain(45, "03x02t");

    // Generate autumn-colored trees.
    this.generateTerrain(3, "02x02t");

    // Generate green trees.
    this.generateTerrain(7, "01x02t");

    this.spawnRamen();
  }

  spawnRamen() {

    // Spawn bowls of ramen noodles.

    let i = 0;

    for (i; i < 20; ++i) {

      let tile_x = 1 + (getRandomNumber() % NUMBER_OF_TILES_X - 1);
      let tile_y = 1 + (getRandomNumber() % NUMBER_OF_TILES_Y - 1);

      this.tiles[tile_x][tile_y] = "04x02f";
    }
  }

  render() {

    let y = 0;

    for (y; y < NUMBER_OF_TILES_Y; ++y) {

      if (y * TILE_SIZE < Camera.getY() - TILE_SIZE) {

        continue;
      }

      if (y * TILE_SIZE > Camera.getY() + (TILE_SIZE * 7)) {

        continue;
      }

      let x = 0;

      for (x; x < NUMBER_OF_TILES_X; ++x) {

        if (x * TILE_SIZE < Camera.getX() - TILE_SIZE) {

          continue;
        }

        if (x * TILE_SIZE > Camera.getX() + (TILE_SIZE * 12)) {

          continue;
        }

        // Split each tile into its axes.
        let axis_x = this.tiles[x][y].substring(0, 2);
        let axis_y = this.tiles[x][y].substring(4, 5);

        // Draw grass beneath each tile.
        Momo.drawClippedBitmap(

          atlas,

          0,

          2 * TILE_SIZE,

          TILE_SIZE,

          TILE_SIZE,

          x * TILE_SIZE - Camera.getX(),

          y * TILE_SIZE - Camera.getY()
        );

        // Draw each tile.
        Momo.drawClippedBitmap(

          atlas,

          axis_x * TILE_SIZE,

          axis_y * TILE_SIZE,

          TILE_SIZE,

          TILE_SIZE,

          x * TILE_SIZE - Camera.getX(),

          y * TILE_SIZE - Camera.getY()
        );
      }
    }
  }

  generateTerrain(probability, tile_code) {

    let y = 0;

    for (y; y < NUMBER_OF_TILES_Y; ++y) {

      let x = 0;

      for (x; x < NUMBER_OF_TILES_X; ++x) {

        if (getRandomNumber() % probability === 1) {

          if (this.tiles[x][y] === "00x02f") {

            // Place the new tile on top of the old grass tile.
            this.tiles[x][y] = tile_code;
          }
        }
      }
    }
  }

  getTileFlag(x, y) {

    if (x < 0 || y < 0 || x > NUMBER_OF_TILES_X - 2 || y > NUMBER_OF_TILES_Y - 2) {

      return "t";
    }

    // Get a given tile's flag.
    return this.tiles[x][y].substring(5, 6);
  }

  setTileFlag(x, y, flag) {

    if (x < 0 || y < 0 || x > NUMBER_OF_TILES_X - 2 || y > NUMBER_OF_TILES_Y - 2) {

      return;
    }

    this.tiles[x][y] = this.tiles[x][y].substring(0, 5) + flag;
  }

  setTileFlagExtra(x, y, flag) {

    if (x < 0 || y < 0 || x > NUMBER_OF_TILES_X - 2 || y > NUMBER_OF_TILES_Y - 2) {

      return;
    }

    if (this.getTile(x, y) === "03x02") {

      return;
    }

    if (this.getTile(x, y) === "02x02") {

      return;
    }

    if (this.getTile(x, y) === "01x02") {

      return;
    }

    if (this.getTile(x, y) !== "99x99") {

      this.tiles[x][y] = this.tiles[x][y].substring(0, 5) + flag;
    }
  }

  getTile(x, y) {

    if (x < 0 || y < 0 || x > NUMBER_OF_TILES_X - 2 || y > NUMBER_OF_TILES_Y - 2) {

      return "99x99";
    }

    // Get a given tile without its flag.
    return this.tiles[x][y].substring(0, 5);
  }

  setTile(x, y, tile_code) {

    if (x < 0 || y < 0 || x > NUMBER_OF_TILES_X - 2 || y > NUMBER_OF_TILES_Y - 2) {

      return;
    }

    this.tiles[x][y] = tile_code;
  }
};
