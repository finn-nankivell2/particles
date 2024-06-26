function randVec(x, y) {
	x = x ?? width;
	y = y ?? height;

	return vec(random(0, x), random(0, y));
}

function randVecAuto(scalar) {
	scalar = scalar ?? height;
	let r = random(0, scalar);
	return vec(r, r);
}

// p5js's functions for creating and applying operations are not ergonomic and thus irritating to use
// I created my own aliases

// Create a vector with coords x, y and z
function vec(x, y, z) {
	return createVector(x, y, z);
}

// Add two vectors without mutating and return the result
function vadd(a, b) {
	return p5.Vector.add(a, b);
}

// Subtract two vectors without mutating and return the result
function vsub(a, b) {
	return p5.Vector.sub(a, b);
}

// Multiply two vectors without mutating and return the result
function vmult(a, b) {
	return p5.Vector.mult(a, b);
}

// Divide two vectors without mutating and return the result
function vdiv(a, b) {
	return p5.Vector.div(a, b);
}

// Class that runs a callback every N frames
class Ticker {
	constructor(tick, callback) {
		this._tick = tick;
		this.start = tick;
		this.callback = callback;
	}

	update() {
		this._tick -= 1;
		if (this._tick < 1) {
			this._tick = this.start;
			this.callback();
		}
	}
}

// Class that generates non-consuective numbers at set intervals
class RaffleRandom {
	constructor(lower, upper, step = 1) {
		this.lower = lower;
		this.upper = upper;
		this.step = step;

		this.numbers = [];
		this.takenNumber = random(lower, (lower-upper)/step)*step;
		this.takenOlder;

		this.fillNumbers();
	}

	fillNumbers() {
		for (let i=this.lower; i<this.upper; i+=this.step) {
			this.numbers.push(i);
		}
	}

	take() {
		let rm = this.numbers.splice(random(0, this.numbers.length-1), 1)[0];
		this.numbers.push(this.takenNumber);
		this.takenNumber = rm;
		return rm;
	}
}

// Experiment with making a checkered background for the game that moves with the buildings. Didn't work out
class ShiftingGridBackground {
	constructor(n = 10, c1 = null, c2 = null) {
		c1 = c1 ?? color("#0a0a0a");
		c2 = c2 ?? color("#292929");

		this.colours = [];

		for (let i = 0, len = n; i < len; i++) {
			this.colours.push(lerpColor(c1, c2, Math.random()));
		}
	}

	getColour(seed) {
		return this.colours[(Math.abs(seed) % this.colours.length)];
	}

	update() {
		let sq = height/15;
		for (let y=0; y<height; y+=sq) {
			for (let x=-sq; x<width+sq; x+=sq) {
				let m = sq/2 + -((frameCount*10) % sq);
				rect(x+m, 0, sq+1, height);
			}
		}
	}
}
