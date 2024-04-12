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

function vec(x, y, z) {
	return createVector(x, y, z);
}

function vadd(a, b) {
	return p5.Vector.add(a, b);
}

function vsub(a, b) {
	return p5.Vector.sub(a, b);
}

function vmult(a, b) {
	return p5.Vector.mult(a, b);
}

function vdiv(a, b) {
	return p5.Vector.div(a, b);
}

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
