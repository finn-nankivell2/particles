const cam = 100;
let palette;
let cubes = [];
let misc = [];
let CENTER;
let raffle;
let lastCube;

// Set up the global variables and Cube spawner
function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	angleMode(DEGREES);
	frameRate(45);

	palette = {
		BLACK: color("#000000"),
		BACKGROUND: color("#0a0a0a"),
		CUBE: color("#b31454"),

		GRAD1: color(random(255), random(255), random(255)),
		GRAD2: color(random(255), random(255), random(255)),
	};

	// This will spawn a new cube every 3 frames
	misc.push(
		new Ticker(3, () => {
			cubes.push(
				new ParticlePseudoCube(
					vec(width + 200, height * 0.1 + raffle.take()),
					vadd(
						vec(width / 80, width / 80),
						randVec(width / 25, width / 25)
					),
					vec(-10, 0),
					random(5, 30),
					palette.CUBE
				)
			);
			lastCube = cubes.at(-1);
		})
	);

	// This generates non-consuective numbers at set intervals
	raffle = new RaffleRandom(0, height * 0.8, height / 10);

	// Define the center of the screen as a vector
	CENTER = vec(width / 2, height / 2);
}

function draw() {
	background(palette.BACKGROUND);

	// Update all items in the misc array
	for (const item of misc) {
		item.update();
	}

	// Sort the cubes update order to try to prevent z fighting
	// The closer they are to the center, the later they are rendered, so that the ones in the center (i.e. the ones "closest" to the focal point of the camera) are rendered last
	cubes.sort((a, b) => a.pos.dist(CENTER) < b.pos.dist(CENTER));

	// Update every cube
	for (const cube of cubes) {
		cube.update();
	}

	// Render the roads
	for (const cube of cubes) {
		cube.renderPath();
	}

	// Render the decorations around the cube to make the roads seem not fully connected
	for (const cube of cubes) {
		cube.renderDecorations();
	}

	// Render the slightly shaded sides of the cubes
	for (const cube of cubes) {
		cube.renderSides();
	}

	// Rebder the tops of the cubes
	for (const cube of cubes) {
		cube.renderTop();
	}

	cubes = cubes.filter((cube) => cube.isOOB());
}

// If the mouse is pressed, spawn a new cube
function mousePressed() {
	let size = vadd(vec(width / 80, width / 80), randVec(width / 25, width / 25));
	cubes.push(
		new ParticlePseudoCube(
			vsub(vec(mouseX, mouseY), vdiv(size, vec(2, 2))),
			size,
			vec(-10, 0),
			random(5, 30),
			palette.CUBE
		)
	);
}
