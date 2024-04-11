class PseudoCube {
	// Constants
	MAGIC = 100;

	constructor(pos, size, height, colour) {
		this.pos = pos;
		this.size = size;
		this.height = height;
		this.computeColour(colour);
	}

	computeColour(colour) {
		this.colour = colour;
		this.sideA = lerpColor(palette.BLACK, this.colour, 0.7);
		this.sideB = lerpColor(palette.BLACK, this.colour, 0.6);
	}

	// Methods
	static fromRandom() {
		return new PseudoCube(
			randVec(),
			p5.Vector.add(randVecAuto(20), vec(30, 30)),
			random(5, 30),
			color("#ffffff")
		);
	}

	centerDistRatio() {
		return CENTER.dist(this.pos) / vec(0, 0).dist(CENTER);
	}

	displacementRatio() {
		let d = this.centerDistRatio();
		const DIVBY = 2;
		let m = map(d, 0, 0.5, 0, DIVBY);
		return (m * map(this.height, 5, 30, 1, DIVBY)) / DIVBY
	}

	displacementAngle() {
		return atan2(this.pos.y - CENTER.y, this.pos.x - CENTER.x);
	}

	calcDisplacement() {
		let a = this.displacementAngle();
		let d = vec(cos(a), sin(a));
		d.mult(this.MAGIC);
		d.mult(this.displacementRatio());
		return d;
	}

	calcRoofSize() {
		let h = map(this.height, 0, 30, 0, 20);
		return p5.Vector.add(this.size, vec(h, h));
	}

	calcDisplacementAndRoof() {
		let displacement = this.calcDisplacement();
		let roof = this.calcRoofSize();
		displacement.sub(p5.Vector.div(roof, 2));
		return [displacement, roof];
	}

	renderSides() {
		let pos = this.pos;
		let size = this.size;
		let [displaced, roof] = this.calcDisplacementAndRoof();
		displaced.add(pos);
		strokeWeight(1);
		noStroke();

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

		// LMFAO
		if (displaced.y < CENTER.y) {
			ooe.push(topmost);

			if (displaced.x < CENTER.x) {
				ooe.push(left);
				ooe.push(right);
			} else {
				ooe.push(right);
				ooe.push(left);
			}

			ooe.push(bottom);
		} else {
			ooe.push(bottom);

			if (displaced.x < CENTER.x) {
				ooe.push(left);
				ooe.push(right);
			} else {
				ooe.push(right);
				ooe.push(left);
			}
			ooe.push(topmost);
		}

		for (let f of ooe) {
			f();
		}
	}

	renderTop() {
		// Displaced vec
		let [displaced, roof] = this.calcDisplacementAndRoof();
		displaced.add(this.pos);

		fill(this.colour);
		rect(displaced.x, displaced.y, roof.x, roof.y);
	}

	update() {
	}

	isOnscreen() {
		let size = vmult(this.size, 2);
		return this.pos.x > -size.x && this.pos.x < width + size.x && this.pos.y > -size.y && this.pos.y < height + size.y;
	}
}


class PseudoCubeParticle extends PseudoCube {
	constructor(pos, size, vel, height, colour) {
		super(pos, size, height, colour);
		this.vel = vel;
		this.height = 9;
		this.ogHeight = this.height;
	}

	update() {
		this.pos.add(this.vel);
		this.height = map(this.centerDistRatio(), 0, 0.5, 50, 20);
		this.computeColour(lerpColor(palette.GRAD1, palette.GRAD2, map(this.pos.x, 0, width, 0, 1)));
	}

	// Methods
	static fromRandom() {
		return new PseudoCubeParticle(
			vadd(randVec(), vec(500, 0)),
			p5.Vector.add(randVecAuto(20), vec(30, 30)),
			random(5, 30),
			palette.CUBE
		);
	}
}
