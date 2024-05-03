// Class for a Cube[oid] object with a position, size, height and colour
// This cube mimics 3D visuals without actually using any 3D code or logic
// Instead, a rect is rendered at the base of the PseudoCube, another rect is rendered at an offset and a slightly larger size - based on distance from the center of the screen
// And then the two rects are connected up to form the sides of the cuboid
// This produces a nice effect
class PseudoCube {
	// Magic number that makes the height scaling look better
	MAGIC = 100;
	SCREEN_BOUNDS_LEFT = 300

	// Construct the cube
	constructor(pos, size, height, colour) {
		this.pos = pos;
		this.size = size;
		this.height = height;
		this.computeColour(colour);
	}

	// Compute what colour it should be
	computeColour(colour) {
		this.colour = colour;
		this.sideA = lerpColor(palette.BLACK, this.colour, 0.7);
		this.sideB = lerpColor(palette.BLACK, this.colour, 0.6);
		this.decor = lerpColor(palette.BLACK, this.colour, 0.4);
	}

	// Create a cube at a random location
	static fromRandom() {
		return new PseudoCube(
			randVec(),
			p5.Vector.add(randVecAuto(20), vec(30, 30)),
			random(5, 30),
			color("#ffffff")
		);
	}

	// Distance from the center divided by the maximum possible distance from the center
	centerDistRatio() {
		return CENTER.dist(this.pos) / vec(0, 0).dist(CENTER);
	}

	// Calculate how much the rects should be diplaced by
	displacementRatio() {
		let d = this.centerDistRatio();
		const DIVBY = 2;
		let m = map(d, 0, 0.5, 0, DIVBY);
		return (m * map(this.height, 5, 30, 1, DIVBY)) / DIVBY;
	}

	// Calculate the angle that the rects should be displaced at
	displacementAngle() {
		return atan2(this.pos.y - CENTER.y, this.pos.x - CENTER.x);
	}

	// Calulate how much the rect should be displaced by as a vector
	calcDisplacement() {
		let a = this.displacementAngle();
		let d = vec(cos(a), sin(a));
		d.mult(this.MAGIC);
		d.mult(this.displacementRatio());
		return d;
	}

	// Calc how big the top rect should be, based on the height
	calcRoofSize() {
		let h = map(this.height, 0, 30, 0, 20);
		return p5.Vector.add(this.size, vec(h, h));
	}

	// Both functions above combined into one, returning a tuple of (displacement, roof)
	calcDisplacementAndRoof() {
		let displacement = this.calcDisplacement();
		let roof = this.calcRoofSize();
		displacement.sub(p5.Vector.div(roof, 2));
		return [displacement, roof];
	}

	// Render the shaded sides of the cuboid
	renderSides() {
		if (!this.isOnscreen()) {
			return;
		}

		let pos = this.pos;
		let size = this.size;
		let [displaced, roof] = this.calcDisplacementAndRoof();
		displaced.add(pos);
		strokeWeight(1);
		noStroke();

		// Lots of code needs to be written here for each edge case

		let left = () => {
			// left side
			fill(this.sideB);
			beginShape();
			vertex(pos.x, pos.y);
			vertex(displaced.x, displaced.y);
			vertex(displaced.x, displaced.y + roof.y);
			vertex(pos.x, pos.y + size.y);
			endShape();
		};

		let right = () => {
			// right side
			fill(this.sideB);
			beginShape();
			vertex(pos.x + size.x, pos.y);
			vertex(displaced.x + roof.x, displaced.y);
			vertex(displaced.x + roof.x, displaced.y + roof.y);
			vertex(pos.x + size.x, pos.y + size.y);
			endShape();
		};

		let bottom = () => {
			// bottom side
			fill(this.sideA);
			beginShape();
			vertex(pos.x, pos.y + size.y);
			vertex(displaced.x, displaced.y + roof.y);
			vertex(displaced.x + roof.x, displaced.y + roof.y);
			vertex(pos.x + size.x, pos.y + size.y);
			endShape();
		};

		let topmost = () => {
			// top side
			fill(this.sideA);
			beginShape();
			vertex(pos.x, pos.y);
			vertex(displaced.x, displaced.y);
			vertex(displaced.x + roof.x, displaced.y);
			vertex(pos.x + size.x, pos.y);
			endShape();
		};

		// Order of events
		let ooe = [];

		// case 1, top left
		if (displaced.x < CENTER.x && displaced.y < CENTER.y) {
			ooe.push(bottom);
			ooe.push(right);
		}
		// case 2, top right
		if (displaced.x > CENTER.x && displaced.y < CENTER.y) {
			ooe.push(bottom);
			ooe.push(left);
		}
		// case 3, bottom left
		if (displaced.x < CENTER.x && displaced.y > CENTER.y) {
			ooe.push(topmost);
			ooe.push(right);
		}
		// case 4, bottom right
		if (displaced.x > CENTER.x && displaced.y > CENTER.y) {
			ooe.push(topmost);
			ooe.push(left);
		}


		if (displaced.x < displaced.y) {
			ooe.push(ooe.shift());
		}

		for (let f of ooe) {
			f();
		}
	}

	// Render the top rect of the cuboid
	renderTop() {
		if (!this.isOnscreen()) {
			return;
		}

		// Displaced vec
		let [displaced, roof] = this.calcDisplacementAndRoof();
		displaced.add(this.pos);

		fill(this.colour);
		rect(displaced.x, displaced.y, roof.x, roof.y);
	}

	update() {}

	// Check if it is on screen
	isOnscreen() {
		let size = this.size;
		return (
			this.pos.x > -size.x &&
			this.pos.x < width + size.x &&
			this.pos.y > -size.y &&
			this.pos.y < height + size.y
		);
	}

	// Check if it is out of bounds (not the same as being on screen, the bounds of the scene are slightly larger than that of the screen)
	isOOB() {
		let size = vmult(this.size, 10);
		return (
			this.pos.x > -size.x &&
			this.pos.x < width + size.x + this.SCREEN_BOUNDS_LEFT &&  // SCREEN_BOUNDS_LEFT pixels larger on the right hand side to allow the cubes to come in from that direction
			this.pos.y > -size.y &&
			this.pos.y < height + size.y
		);
	}
}

// A ParticlePseudoCube is the same as a PseudoCube except it moves during the update and provides a couple more methods
// It also renders a little line between it and another cube to mimic roads
class ParticlePseudoCube extends PseudoCube {
	constructor(pos, size, vel, height, colour) {
		super(pos, size, height, colour);
		this.vel = vel;
		this.height = 60;
		this.ogHeight = this.height;
		this.connection = this.closestCube();
	}

	update() {
		this.pos.add(this.vel);
		this.height = map(this.centerDistRatio(), 0, 0.5, 50, 20);
		this.computeColour(
			lerpColor(
				palette.GRAD1,
				palette.GRAD2,
				map(this.pos.x, 0, width, 0, 1)
			)
		);
	}

	// Methods
	static fromRandom() {
		return new ParticlePseudoCube(
			vadd(randVec(), vec(500, 0)),
			p5.Vector.add(randVecAuto(20), vec(30, 30)),
			random(5, 30),
			palette.CUBE
		);
	}

	closestCube(target) {
		let choice;
		let maxD = width;
		for (const cube of cubes.filter(c => c.pos.x > CENTER.x)) {
			let d = cube.pos.dist(this.pos);
			if (d < maxD) {
				maxD = d;
				choice = cube;
			}
		}
		return choice;
	}

	renderPath() {
		let con = this.connection;

		strokeWeight(10);
		stroke(this.decor);
		if (con) {
			let target = vadd(con.pos, vdiv(con.size, 2));
			let origin = vadd(this.pos, vdiv(this.size, 2));

			line(origin.x, origin.y, target.x, origin.y);
			line(target.x, origin.y, target.x, target.y);
		}

	}

	renderDecorations() {
		strokeWeight(10);
		stroke(this.decor);
		const PADDING = 20;

		noStroke();
		fill(palette.BACKGROUND);
		rect(
			this.pos.x - PADDING / 2,
			this.pos.y - PADDING / 2,
			this.size.x + PADDING,
			this.size.y + PADDING
		);
	}
}
