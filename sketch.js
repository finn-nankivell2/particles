const cam = 100;
let palette;
let cubes = [];
let misc = [];
let CENTER;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	angleMode(DEGREES);

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
		new Ticker(1, () => {
			cubes.push(
				new PseudoCubeParticle(
					vec(width, random(0, height)),
					vadd(vec(30, 30), randVecAuto(20)),
					vec(-10, 0),
					random(5, 30),
					palette.CUBE
				)
			);
		})
	);

	CENTER = vec(width / 2, height / 2);
}

function draw() {
	background("#1f1f1f");
	cubes.sort((a, b) => a.pos.dist(CENTER) < b.pos.dist(CENTER));

	for (const cube of cubes) {
		cube.update();
	}

	for (const cube of cubes) {
		cube.renderSides();
	}

	for (const cube of cubes) {
		cube.renderTop();
	}

	for (const item of misc) {
		item.update();
	}

	cubes = cubes.filter((cube) => cube.isOnscreen());
}
