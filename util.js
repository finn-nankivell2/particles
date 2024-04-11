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
