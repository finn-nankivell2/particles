const cam = 100;
let palette;
let cubes = [];
let misc = [];
let CENTER;
let raffle;
let lastCube;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	angleMode(DEGREES);
	frameRate(45);

	let colours = [
		"#ae6331",
		"#b55839",
		"#bc4d41",
		"#c34249",
		"#ca3751",
		"#d12c59",
		"#d82161",
		"#df1669"
	]

	palette = {
		BLACK: color("#000000"),
		BACKGROUND: color("#0a0a0a"),
		// CUBE: color("#52528C"),
		CUBE: color("#b31454"),

		GRAD1: color(random(255), random(255), random(255)),
		GRAD2: color(random(255), random(255), random(255)),

		// GRAD1: color(colours[0]),
		// GRAD2: color(colours.pop()),

		// GRAD1: color("#b31454"),
		// GRAD2: color("#66d1e0"),
	};

	// misc.push(new Ticker(1, () => {
	// 	cubes.push(
	// 		new PseudoCubeParticle(
	// 			CENTER.copy(),
	// 			vadd(vec(30, 30), randVecAuto(20)),
	// 			vmult(p5.Vector.fromAngle(random(0, 360)), 5),
	// 			random(5, 30),
	// 			palette.CUBE
	// 		)
	// 	)
	// }));

	misc.push(
		new Ticker(3, () => {
			cubes.push(
				new ParticlePseudoCube(
					vec(width + 200, height*0.1 + raffle.take()),
					// vec(width + 200, randomGaussian(height/2, height/4)),
					// vec(width + 200, random(0, height/20)*20),
					vadd(vec(width/80, width/80), randVec(width/25, width/25)),
					vec(-10, 0),
					random(5, 30),
					palette.CUBE
				)
			);
			lastCube = cubes.at(-1);
		})
	);


	raffle = new RaffleRandom(0, height*0.8, height/10);
	CENTER = vec(width / 2, height / 2);
}

function draw() {
	background(palette.BACKGROUND);

	for (const item of misc) {
		item.update();
	}

	cubes.sort((a, b) => a.pos.dist(CENTER) < b.pos.dist(CENTER));

	for (const cube of cubes) {
		cube.update();
	}

	for (const cube of cubes) {
		cube.renderPath();
	}

	for (const cube of cubes) {
		cube.renderDecorations();
	}

	for (const cube of cubes) {
		cube.renderSides();
	}

	for (const cube of cubes) {
		cube.renderTop();
	}

	cubes = cubes.filter((cube) => cube.isOOB());
}
