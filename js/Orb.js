class Orb {
    constructor(x, y, r, vx = 0.5, vy = 0.5) {
        this.position = {
            x,
            y
        };
        this.velocity = {
            x: vx,
            y: vy
        };
        this.r = r;
        this.damping = 0.8;
    }

    move(gravity) {
        this.velocity.x += gravity.x;
        this.velocity.y += gravity.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    display(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.fill();
        ctx.closePath();
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