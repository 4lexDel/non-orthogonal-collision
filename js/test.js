const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const segments = 10;
const ground = new Array(segments);
const gravity = { x: 0, y: 0.05 };
const orbs = [];

class Ground {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x = (x1 + x2) / 2;
        this.y = (y1 + y2) / 2;
        this.len = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        this.rot = Math.atan2(y2 - y1, x2 - x1);
    }
}

class Orb {
    constructor(x, y, r) {
        this.position = { x, y };
        this.velocity = { x: 0.5, y: 0 };
        this.r = r;
        this.damping = 0.8;
    }

    move() {
        this.velocity.x += gravity.x;
        this.velocity.y += gravity.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    display() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = '#c8c8c8';
        ctx.fill();
    }

    checkWallCollision() {
        if (this.position.x > canvas.width - this.r) {
            this.position.x = canvas.width - this.r;
            this.velocity.x *= -this.damping;
        } else if (this.position.x < this.r) {
            this.position.x = this.r;
            this.velocity.x *= -this.damping;
        }
    }

    checkGroundCollision(groundSegment) {
        let deltaX = this.position.x - groundSegment.x;
        let deltaY = this.position.y - groundSegment.y;
        let cosine = Math.cos(groundSegment.rot);
        let sine = Math.sin(groundSegment.rot);

        let groundXTemp = cosine * deltaX + sine * deltaY;
        let groundYTemp = cosine * deltaY - sine * deltaX;
        let velocityXTemp = cosine * this.velocity.x + sine * this.velocity.y;
        let velocityYTemp = cosine * this.velocity.y - sine * this.velocity.x;

        if (groundYTemp > -this.r && this.position.x > groundSegment.x1 && this.position.x < groundSegment.x2) {
            groundYTemp = -this.r;
            velocityYTemp *= -1.0;
            velocityYTemp *= this.damping;
        }

        const updatedDeltaX = cosine * groundXTemp - sine * groundYTemp;
        const updatedDeltaY = cosine * groundYTemp + sine * groundXTemp;
        this.velocity.x = cosine * velocityXTemp - sine * velocityYTemp;
        this.velocity.y = cosine * velocityYTemp + sine * velocityXTemp;
        this.position.x = groundSegment.x + updatedDeltaX;
        this.position.y = groundSegment.y + updatedDeltaY;
    }
}

function setup() {
    for (let i = 0; i < segments; i++) {
        const x1 = (canvas.width / segments) * i;
        const y1 = Math.random() * 10 + canvas.height - 40;
        const x2 = (canvas.width / segments) * (i + 1);
        const y2 = Math.random() * 10 + canvas.height - 30;
        ground[i] = new Ground(x1, y1, x2, y2);
    }

    console.log(ground);

    orbs.push(new Orb(50, 50, 10));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const orb of orbs) {
        orb.move();
        orb.display();
        orb.checkWallCollision();

        for (const groundSegment of ground) {
            orb.checkGroundCollision(groundSegment);
        }
    }

    ctx.fillStyle = '#7f7f7f';
    ctx.beginPath();
    ctx.moveTo(ground[0].x1, ground[0].y1);
    for (const groundSegment of ground) {
        ctx.lineTo(groundSegment.x2, groundSegment.y2);
    }
    ctx.lineTo(ground[segments - 1].x2, canvas.height);
    ctx.lineTo(ground[0].x1, canvas.height);

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    requestAnimationFrame(draw);
}

setup();
draw();