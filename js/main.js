let state = 0;

let shortest_distance = 0;
let nearest_kitten_number = 0;

let show_kitten_names = true;

let angle = 0;
let new_angle = 0;

let current_time = "15:00";

let hours = 15;
let minutes = 0;
let seconds = 0;

let ticks = 0;

let flash_ticks = 0;

let flash_yellow = false;

let gain = 1.0;

let ready_to_win = false;
let ready_to_lose = false;

let alpha = [0.0, 255.0, 0.0];

let strings = [""];

let fade_intro = true;

let credits_y = 0;

function main() {

  if (!Momo.initialize()) {

    // Failed to initialize Momo.
    return;
  }

  if (!Momo.setCanvas("game", CANVAS_W, CANVAS_H)) {

    // Failed to set the canvas.
    return;
  }

  Momo.setFrameRate(60);

  Momo.installKeyboard();

  if (!loadResources()) {

    // Failed to load resources; display error image.
    document.getElementById("game").style.backgroundImage = "url('data/png/error.png')";

    return;
  }

  Momo.resourcesLoaded(

    () => {

      Momo.createLoop(

        () => {

          update();

          render();
        }
      );
    }
  );
}

function update() {

  if (Momo.isKeyPressed("e")) {

    let k = 0;

    for (k; k < kittens.length; ++k) {

      // It's a secret to everybody...
      kittens[k].setName("Eric #" + (k + 1));
    }
  }

  if (gain > 0.1) {

    Momo.playSound(annoying, gain, 1.0, true);
  }
  else {

    Momo.stopSound(annoying);
  }

  switch (state) {

    case 0:

      // Intro.

      if (Momo.isKeyPressed("z")) {

        // @TODO: Fade into the next state with a black transition.
        ++state;
      }
    break;

    case 1:

      // Normal.

      Nini.update();

      Camera.update();

      let distances = [0];

      let i = 0;

      for (i; i < kittens.length; ++i) {

        distances[i] = 999999;
      }

      i = 0;

      for (i; i < kittens.length; ++i) {

        if (kittens[i].hasReturnedToMama()) {

          continue;
        }

        kittens[i].update();

        let x1 = (Nini.getX() / TILE_SIZE) | 0;
        let y1 = (Nini.getY() / TILE_SIZE) | 0;

        let x2 = kittens[i].getTileX();
        let y2 = kittens[i].getTileY();

        distances[i] = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
      }

      if (kittens_found == kittens.length) {

        shortest_distance = 0;
      }
      else {

        shortest_distance = 999;
      }

      i = 0;

      for (i; i < distances.length; ++i) {

        if (distances[i] <= shortest_distance) {

          nearest_kitten_number = i;

          shortest_distance = distances[i] | 0;
        }
      }

      if (Momo.isKeyPressed("t")) {

        show_kitten_names = !show_kitten_names;
      }

      new_angle = Math.atan2(

        Nini.getY() - kittens[nearest_kitten_number].getY(),

        Nini.getX() - kittens[nearest_kitten_number].getX()
      );

      new_angle += (45 * 180 / Math.PI);

      if (angle === 0) {

        angle = new_angle;
      }

      if (angle !== new_angle) {

        // Interpolate between angles.

        let difference = Math.abs(angle - new_angle);

        if (angle < new_angle) {

          angle += difference * 0.1;
        }
        else if (angle > new_angle) {

          angle -= difference * 0.1;
        }
      }

      ++seconds;

      if (seconds >= 60) {

        ++minutes;

        seconds = 0;
      }

      if (minutes >= 60) {

        ++hours;

        minutes = 0;
      }

      if (hours > 23) {

        // Roll over hours.
        hours = 0;
      }

      ++ticks;

      if (ticks > 60) {

        current_time = "";

        if (hours < 10) {

          current_time += "0";
        }

        current_time += hours + ":";

        if (minutes < 10) {

          current_time += "0";
        }

        current_time += minutes;
      }

      if (hours >= 18 && !ready_to_win) {

        // Kittens not found by sundown. Lose the game.
        ready_to_lose = true;
      }

      if (kittens_found === kittens.length) {

        ready_to_win = true;
      }

      if ((ready_to_lose || ready_to_win) && gain > 0.1) {

        // Fade out the background music.
        gain -= 0.006;
      }
    break;

    case 2:

      // Lose.
      if (Momo.isKeyPressed("z")) {

        state = 4;
      }
    break;

    case 3:

      // Win.

      if (Momo.isKeyPressed("z")) {

        state = 4;
      }
    break;

    case 4:

      // Credits.

      credits_y += 2;
    break;
  }
}

function render() {

  Momo.clearCanvas(Momo.makeColor(0, 0, 0));

  let i = 0;

  switch (state) {

    case 0:

      // Intro.

      strings = [

        "Oh no! Your kittens have gone missing!",

        "Find them before nightfall, lest they",

        "freeze to death in this chilly autumn",

        "weather! Sunset is at 18:00! Be quick!",

        "Also, dinner tonight is ramen noodles.",

        "Press \"Z\" to continue."
      ];

      i = 0;

      for (i; i < strings.length; ++i) {

        Momo.drawText(

          font,

          Momo.makeColor(255, 255, 255),

          16,

          72,

          72 + (32 * (i === strings.length - 1 ? 7 : i)),

          Momo.TEXT_ALIGN_LEFT,

          strings[i]
        );
      }
    break;

    case 1:

      // Normal.

      Map.render();

      Nini.render();

      i = 0;

      for (i; i < kittens.length; ++i) {

        kittens[i].render();
      }

      if (show_kitten_names) {

        i = 0;

        for (i; i < kittens.length; ++i) {

          if (kittens[i].hasReturnedToMama()) {

            continue;
          }

          Momo.drawText(

            font,

            Momo.makeColor(255, 255, 255),

            16,

            kittens[i].getX() - Camera.getX() + TILE_SIZE / 2,

            kittens[i].getY() - Camera.getY() - TILE_SIZE / 2,

            Momo.TEXT_ALIGN_CENTER,

            kittens[i].getName()
          );
        }
      }

      if (kittens_found < kittens.length) {

        // Draw compass pointing to nearest kitten.
        Momo.drawRotatedImage(

          arrow,

          32,

          32,

          Nini.getX() - Camera.getX(),

          Nini.getY() - Camera.getY(),

          angle
        );
      }

      if (hours >= 17) {

        if (alpha[0] < 180.0) {

          // Take one in-game hour to transition to dark.
          alpha[0] += 0.05;
        }
      }

      if (fade_intro) {

        alpha[1] -= 3.2;

        if (alpha[1] < 0) {

          alpha[1] = 0;
        }

        if (alpha[1] <= 0) {

          fade_intro = false;
        }
      }

      if (hours >= 17) {

        Momo.drawFilledRectangle(0, 0, CANVAS_W, CANVAS_H, Momo.makeColor(0, 0, 0, alpha[0]));
      }

      Momo.drawText(

        font,

        Momo.makeColor(255, 255, 255),

        16,

        16,

        16,

        Momo.TEXT_ALIGN_LEFT,

        "Score: " + points
      );

      Momo.drawText(

        font,

        Momo.makeColor(255, 255, 255),

        16,

        CANVAS_W / 2,

        16,

        Momo.TEXT_ALIGN_CENTER,

        kittens_found + "/" + kittens.length
      );

      /*Momo.drawText(

        font,

        Momo.makeColor(255, 255, 255),

        16,

        16,

        CANVAS_H - 32,

        Momo.TEXT_ALIGN_LEFT,

        kittens[nearest_kitten_number].getName() + ": " + shortest_distance + "m"
      );*/

      Momo.drawText(

        font,

        Momo.makeColor(255, 255, 255),

        16,

        CANVAS_W - 16,

        16,

        Momo.TEXT_ALIGN_RIGHT,

        "Time: " + current_time
      );

      if (fade_intro) {

        Momo.drawFilledRectangle(0, 0, CANVAS_W, CANVAS_H, Momo.makeColor(0, 0, 0, alpha[1]));
      }

      if (ready_to_lose || ready_to_win) {

        alpha[2] += 1.6;

        if (alpha[2] > 255) {

          alpha[2] = 255;
        }

        Momo.drawFilledRectangle(0, 0, CANVAS_W, CANVAS_H, Momo.makeColor(0, 0, 0, alpha[2]));

        if (alpha[2] >= 255) {

          if (ready_to_win) {

            // Player won.
            state = 3;
          }
          else if (ready_to_lose) {

            // Player lost.
            state = 2;
          }
        }
      }
    break;

    case 2:

      // Lose.

      strings = [

        "You were not quick enough. Sadly, " + (kittens.length - kittens_found),

        "kitten" + ((kittens.length - kittens_found) === 1 ? "" : "s") + " perished in the cold of night.",

        "From dust to dust...",

        "",

        "Score: " + points,

        "Time bonus: 0",

        "Grand total: " + points,

        "",

        "Press \"Z\" to end your misery..."
      ];

      i = 0;

      for (i; i < strings.length; ++i) {

        Momo.drawText(

          font,

          Momo.makeColor(255, 0, 0),

          16,

          72,

          72 + (32 * i),

          Momo.TEXT_ALIGN_LEFT,

          strings[i]
        );
      }
    break;

    case 3:

      // Win.

      strings = [

        "You did it! You found your kittens!",

        "With time to spare, too! Now you can",

        "go home and enjoy noodles for dinner!",

        "",

        "Score: " + points,

        "Time bonus: " + ((1080 - (hours * 60) + minutes) * 50),

        "Grand total: " + (points + (1080 - (hours * 60) + minutes) * 50),

        "",

        "Press \"Z\" to continue."
      ];

      ++flash_ticks;

      if (flash_ticks > 15) {

        flash_ticks = 0;

        flash_yellow = !flash_yellow;
      }

      i = 0;

      for (i; i < strings.length; ++i) {

        Momo.drawText(

          font,

          flash_yellow ? Momo.makeColor(255, 255, 0) : Momo.makeColor(255, 255, 255),

          16,

          72,

          72 + (32 * i),

          Momo.TEXT_ALIGN_LEFT,

          strings[i]
        );
      }
    break;

    case 4:

      // Credits.

      strings = [

        "KrampusHack 2016",

        "",

        "Participants",

        "Amarillion",

        "Derezo",

        "Edgar Reynaldo",

        "Elias",

        "Eric Johnson",

        "GullRaDriel",

        "m c",

        "Mark Oates",

        "MiquelFire",

        "Onewing",

        "SiegeLord",

        "Takaaki Furukawa",

        "Vanneto",

        "",

        "Special Thanks",

        "Robin Kettman"
      ];

      let sizes = [

        32,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16,

        16
      ];

      let colors = [

        Momo.makeColor(255, 0, 0),

        Momo.makeColor(0, 0, 0),

        Momo.makeColor(255, 0, 0),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(255, 255, 255),

        Momo.makeColor(0, 0, 0),

        Momo.makeColor(255, 0, 0),

        Momo.makeColor(255, 255, 255)
      ];

      i = 0;

      for (i; i < strings.length; ++i) {

        Momo.drawText(

          font,

          colors[i],

          sizes[i],

          CANVAS_W / 2,

          CANVAS_H - credits_y + (TILE_SIZE / 2 * i),

          Momo.TEXT_ALIGN_CENTER,

          strings[i]
        );
      }

      Momo.drawPartialImage(

        atlas,

        4 * TILE_SIZE,

        2 * TILE_SIZE,

        TILE_SIZE,

        TILE_SIZE,

        CANVAS_W / 2 - (TILE_SIZE / 2),

        CANVAS_H - credits_y + (TILE_SIZE / 2 * (strings.length + 1))
      );

      if (credits_y > 1150) {

        Momo.drawText(

          font,

          Momo.makeColor(255, 255, 255),

          16,

          CANVAS_W / 2,

          CANVAS_H / 2,

          Momo.TEXT_ALIGN_CENTER,

          "Thanks for playing!"
        );
      }
    break;
  }
}

function loadResources() {

  let result = true;

  // Load images.
  atlas = Momo.loadImage("data/png/atlas.png");
  arrow = Momo.loadImage("data/png/arrow.png");

  // Load fonts.
  font = Momo.loadFont("data/ttf/font.ttf");

  // Load sounds.
  meow = Momo.loadSound("data/mp3/meow.mp3");
  annoying = Momo.loadSound("data/mp3/annoying.mp3");
  kitten_meow = Momo.loadSound("data/mp3/kitten_meow.mp3");

  result = !!meow && !!annoying && !!kitten_meow;

  Nini.spawn();

  let kitten_names = [

    "Cocoa",

    "Fred",

    "Brownie",

    "Mac",

    "Mittens",

    "Cheese",

    "Niki",

    "Bob",

    "Mimi",

    "Bub",

    "Gus",

    "Mochi",

    "Bitsy",

    "Doughnut",

    "Tom"
  ];

  let i = 0;

  for (i; i < kitten_names.length; ++i) {

    // Spawn kittens.

    kittens[i] = new Kitten();

    kittens[i].spawn();

    kittens[i].setName(kitten_names[i]);
  }

  return result;
}

Momo.setEntryPoint(main);
