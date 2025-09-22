const IMG_URL = "./assets/images/background/City-Spring.jpg";
const TEXT_TO_SHOW = "We'll be starting soon!";
const END_TEXT_TO_SHOW = "We're starting now!";
const d = document;
const headerTextEle = d.getElementById("heading-text");
const hamburgerEle = d.getElementsByClassName("hamburger")[0];
const navbarEle = d.getElementsByClassName("navbar")[0];
const logoInpEle = d.getElementById("logo-input");
const logoContentEle = d.getElementsByClassName("logo")[0];
const textInpEle = d.getElementById("text-input");
const timerInpEle = d.getElementById("timer-input");
const timerCountEle = d.getElementById("timer-count");
const timerInpHldrEle = d.getElementById("timer-input-hldr");
const textContentEle = d.getElementById("text-content");
const textContentHldrEle = d.getElementById("text-content-hldr");
const textShownEle = d.getElementById("heading-text");
const timerShownEle = d.getElementsByClassName("countdown-container")[0];
const hamburger = d.querySelector(".hamburger");
const menu = d.querySelector(".navbar");
const bod = d.querySelector(".container");
const countdownContainer = d.querySelector(".countdown-container");
const unsplashApiUrl =
  "https://api.unsplash.com/photos/random?query=summer,forest&orientation=landscape&content_filter=high&count=1";
const requestOptions = {
  method: "GET",
  headers: {
    Authorization: "Client-ID c00Hg1_R_NmgzORAwgRNsc4T5l2pAP7kiv0QXhBhjd0",
  },
};
let song;
let song2;
let fft;
let particles = [];
let img;
let timerAvl = false;
let isTextShown = true;
let isTimerShown = true;
let isLinearWave = false;
let isSplEffectsEnabled = true;
let isSongStopped = false;
let timeInMins = 5;

/**
 * Preloads assets and performs initialization before the sketch starts.
 */
async function preload() {
  const inputSelect = createSelect();
  inputSelect.option("Select Music", "");
  inputSelect.option(
    "cinematic-chillhop",
    "./assets/music/cinematic-chillhop.mp3",
  );
  inputSelect.option("forest-lullaby", "./assets/music/forest-lullaby.mp3");
  inputSelect.option(
    "in-the-forest-ambience",
    "./assets/music/in-the-forest-ambience.mp3",
  );
  inputSelect.option("just-relax", "./assets/music/just-relax.mp3");
  inputSelect.option("lofi-chill", "./assets/music/lofi-chill.mp3");
  inputSelect.option("onceagain", "./assets/music/onceagain.mp3");
  inputSelect.option("open-sky", "./assets/music/open-sky.mp3");
  inputSelect.option(
    "rainbow-after-rain",
    "./assets/music/rainbow-after-rain.mp3",
  );

  song2 = loadSound("./assets/music/brands/ascension/timer-end.mp3");
  inputSelect.changed(() => {
    const selectedValue = inputSelect.value();
    if (!song) {
      song = loadSound(selectedValue);
    } else {
      song.setPath(selectedValue);
    }
    song.loop();
  });
  inputSelect.id("music-select");
  inputSelect.parent("music-select-hldr");

  // const unsplashRandomImg = await fetchImage(unsplashApiUrl, requestOptions);
  const unsplashRandomImg = "";
  /**
   * Loads an image from the specified URL.
   * @type {p5.Image}
   */
  if (unsplashRandomImg) {
    img = loadImage(unsplashRandomImg);
  } else {
    img = loadImage(IMG_URL);
  }
}

/**
 * Sets up the initial configuration of the sketch.
 */
function setup() {
  /**
   * Creates a canvas with the dimensions of the window.
   * @param {number} windowWidth - The width of the window.
   * @param {number} windowHeight - The height of the window.
   */
  createCanvas(windowWidth, windowHeight);

  /**
   * Sets the angle mode to degrees.
   */
  angleMode(DEGREES);

  /**
   * Sets the image mode to center.
   */
  imageMode(CENTER);

  /**
   * Sets the rectangle mode to center.
   */
  rectMode(CENTER);

  /**
   * Creates a Fast Fourier Transform (FFT) object with the specified smoothing and bin count.
   * @param {number} smoothing - The amount of smoothing to apply to the FFT analysis (0.0 to 1.0).
   * @param {number} bins - The number of frequency bins to divide the audio spectrum into.
   */
  fft = new p5.FFT(0.8, 512);

  /**
   * Applies a blur filter to the image.
   * @param {number} filterType - The type of blur filter to apply.
   * @param {number} filterParam - The parameter value for the blur filter.
   */
  img.filter(BLUR, 1);

  /**
   * Stops the draw loop from continuously executing.
   */
  noLoop();
}

/**
 * Draws the visual elements and updates the animation frame.
 */
function draw() {
  /**
   * Sets the background color to black.
   */
  background(0);

  /**
   * Translates the origin of the coordinate system to the center of the canvas.
   * @param {number} width - The width of the canvas.
   * @param {number} height - The height of the canvas.
   */
  translate(width / 2, height / 2);

  /**
   * Analyzes the audio using Fast Fourier Transform (FFT).
   */
  fft.analyze();

  /**
   * Retrieves the energy level of a specific frequency range.
   * @param {number} lowFreq - The lower frequency bound.
   * @param {number} highFreq - The higher frequency bound.
   * @returns {number} The energy level of the specified frequency range.
   */
  amp = fft.getEnergy(20, 200);

  /**
   * Saves the current transformation matrix.
   */
  push();

  /**
   * Displays an image at the center of the canvas with an increased size.
   * @param {p5.Image} img - The image to be displayed.
   * @param {number} x - The x-coordinate of the image's center.
   * @param {number} y - The y-coordinate of the image's center.
   * @param {number} w - The width of the image.
   * @param {number} h - The height of the image.
   */
  image(img, 0, 0, width + 100, height + 100);
  /**
   * Restores the transformation matrix to its previously saved state.
   */
  pop();

  /**
   * Maps the amplitude value to an alpha value for the fill color.
   * @param {number} value - The value to be mapped.
   * @param {number} start1 - The lower bound of the input range.
   * @param {number} stop1 - The upper bound of the input range.
   * @param {number} start2 - The lower bound of the output range.
   * @param {number} stop2 - The upper bound of the output range.
   * @returns {number} The mapped value.
   */
  var alpha = map(amp, 0, 255, 100, 150);

  /**
   * Sets the fill color with a low alpha value.
   * @param {number} gray - The grayscale value of the fill color.
   * @param {number} alpha - The alpha value of the fill color.
   */
  fill(20, alpha);

  /**
   * Disables stroke for the following shapes.
   */
  noStroke();

  /**
   * Draws a rectangle at the center of the canvas with the same dimensions as the canvas.
   * @param {number} x - The x-coordinate of the rectangle's center.
   * @param {number} y - The y-coordinate of the rectangle's center.
   * @param {number} w - The width of the rectangle.
   * @param {number} h - The height of the rectangle.
   */
  rect(0, 0, width, height);

  /**
   * Sets the stroke color for the ring.
   */
  stroke(255);

  /**
   * Sets the weight of the stroke for the ring.
   */
  strokeWeight(3);

  /**
   * Disables fill for the following shapes.
   */
  noFill();

  /**
   * Retrieves the waveform data from the FFT analysis.
   * @returns {number[]} An array of waveform values.
   */
  var wave = fft.waveform();
  if (isLinearWave) {
    for (var i = 0; i < width; i++) {
      let index = floor(map(i, 0, width, 0, wave.length));
      let x = i - 1720;
      let y = wave[index] * 300 + height / 8 - 170;
      point(x, y);
    }
  } else {
    /**
     * Draws two sets of shapes to create a ring effect.
     */
    for (var t = -1; t <= 1; t += 2) {
      /**
       * Begins a new shape for the ring.
       */
      beginShape();

      /**
       * Draws a series of vertices to form the ring shape.
       */
      for (var i = 0; i <= 180; i += 0.5) {
        /**
         * Maps the index value to the range of the waveform array.
         * @param {number} value - The value to be mapped.
         * @param {number} start1 - The lower bound of the input range.
         * @param {number} stop1 - The upper bound of the input range.
         * @param {number} start2 - The lower bound of the output range.
         * @param {number} stop2 - The upper bound of the output range.
         * @returns {number} The mapped value.
         */
        var index = floor(map(i, 0, 180, 0, wave.length - 1));

        /**
         * Maps the waveform value to a radius value for the ring.
         * @param {number} value - The value to be mapped.
         * @param {number} start1 - The lower bound of the input range.
         * @param {number} stop1 - The upper bound of the input range.
         * @param {number} start2 - The lower bound of the output range.
         * @param {number} stop2 - The upper bound of the output range.
         * @returns {number} The mapped value.
         */
        var r = map(wave[index], -1, 1, 150, 350);

        /**
         * Calculates the x-coordinate of a point on the ring.
         * @param {number} angle - The angle in degrees.
         * @returns {number} The x-coordinate.
         */
        var x = r * sin(i) * t;

        /**
         * Calculates the y-coordinate of a point on the ring.
         * @param {number} angle - The angle in degrees.
         * @returns {number} The y-coordinate.
         */
        var y = r * cos(i);

        /**
         * Adds a vertex to the shape.
         * @param {number} x - The x-coordinate of the vertex.
         * @param {number} y - The y-coordinate of the vertex.
         */
        vertex(x, y);
      }

      /**
       * Ends the shape for the ring.
       */
      endShape();
    }
  }
  if (isSplEffectsEnabled && !isLinearWave) {
    /**
     * Creates a new particle object.
     * @constructor
     */
    var p = new Particle();

    /**
     * Adds the particle to the array of particles.
     */
    particles.push(p);

    /**
     * Updates and displays each particle in the array.
     */
    for (var i = particles.length - 1; i >= 0; i--) {
      /**
       * Checks if the particle is within the canvas boundaries.
       * @returns {boolean} True if the particle is within the boundaries, false otherwise.
       */
      if (!particles[i].edges()) {
        /**
         * Updates the particle's position and behavior based on the amplitude value.
         * @param {boolean} condition - The condition to determine the particle's behavior.
         */
        particles[i].update(amp > 230);

        /**
         * Displays the particle on the canvas.
         */
        particles[i].show();
      } else {
        /**
         * Removes the particle from the array if it is outside the canvas boundaries.
         */
        particles.splice(i, 1);
      }
    }
  }
}

/**
 * Handles the mouse click event.
 */
function mouseClicked(evt) {
  /**
   * Checks if the song is available.
   * @returns {void} Returns early if the song is not available.
   */
  if (!song || evt.target === hamburgerEle || evt.target === navbarEle) {
    return;
  }

  /**
   * Checks if the song is currently playing.
   */
  if (song.isPlaying()) {
    /**
     * Pauses the song.
     */
    song.pause();

    /**
     * Stops the draw loop.
     */
    noLoop();
  } else {
    if (!isSongStopped) {
      /**
       * Plays the song.
       */
      song.play();

      /**
       * Restarts the draw loop.
       */
      loop();
    }

    /**
     * Checks if the timer is available.
     */
    if (!timerAvl && isTimerShown) {
      /**
       * Starts the countdown clock.
       * @param {number} time - The time in minutes for the countdown.
       * @param {string} unit - The unit of time for the countdown.
       */
      countDownClock(
        timeInMins,
        isTimerShown,
        song,
        song2,
        isSongStopped,
        END_TEXT_TO_SHOW,
      );

      /**
       * Shows the countdown container.
       */
      countdownContainer.classList.remove("hide");

      /**
       * Sets the timer availability to true.
       */
      timerAvl = true;
    }
  }
}

/**================================================================================================**/
/**
 * Animates the text in the specified element.
 */
// headerTextEle.innerHTML = TEXT_TO_SHOW;
// animateText(isTextShown);

/**
 * Hamburger open and close
 */

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("isactive");
  menu.classList.toggle("active");
});

textInpEle.onchange = () => {
  isTextShown = textInpEle.checked;
  if (textInpEle.checked) {
    textShownEle.classList.remove("hide");
    textContentHldrEle.classList.remove("hide");
  } else {
    textShownEle.classList.add("hide");
    textContentHldrEle.classList.add("hide");
  }
};
logoInpEle.onchange = () => {
  if (logoInpEle.checked) {
    logoContentEle.classList.remove("hide");
  } else {
    logoContentEle.classList.add("hide");
  }
};
timerInpEle.onchange = () => {
  isTimerShown = timerInpEle.checked;
  if (timerInpEle.checked) {
    timerShownEle.classList.remove("hide");
    timerInpHldrEle.classList.remove("hide");
  } else {
    timerShownEle.classList.add("hide");
    timerInpHldrEle.classList.add("hide");
  }
};
timerCountEle.onchange = () => {
  timeInMins = parseInt(timerCountEle.value) || 5;
};

textContentEle.onchange = () => {
  headerTextEle.innerHTML = textContentEle.value;
  animateText(isTextShown);
};
