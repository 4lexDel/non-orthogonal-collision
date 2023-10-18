class Game extends GameBase { //A renommer ?
    constructor(canvas, fullscreen = true) {
        super(canvas, fullscreen)

        this.init();
    }

    async init() {
        /*---------Draw settings----------------------*/
        this.FPS = 60;
        this.prevTick = 0;

        /*----------------Mouse-----------------------*/
        this.mousePressed = false;

        this.mouseX = 0;
        this.mouseY = 0;

        /*---------------INIT-------------------------*/
        this.resize();

        this.gravity = {
            x: 0,
            y: 0.25
        };

        this.segments = 70;

        this.setupGame();

        /*---------------Screen settings--------------*/
        window.onresize = (e) => {
            this.resize();
            this.setupGame();
        };

        /*----------------START-----------------------*/
        this.draw();
    }

    setupGame() {
        this.ground = [];
        this.obstacle = [];

        this.orbs = [];

        this.initOrb(100);

        // this.generateObstacle();

        this.generateGround();
    }

    initOrb(nb = 50) {
        for (let i = 0; i < nb; i++) {
            this.orbs.push(new Orb((50 + Math.random() * this.canvas.width - 100), Math.random() * 80, 8, Math.random() * 5, Math.random() * 5));
        }
    }

    generateGround() {
        const peakHeights = [];
        for (let i = 0; i <= this.segments; i++) {
            peakHeights.push(Math.random() * 10 + this.canvas.height - 60);
        }

        const segs = this.segments;
        for (let i = 0; i < this.segments; i++) {
            this.ground[i] = new Segment((this.canvas.width / segs) * i, peakHeights[i], (this.canvas.width / segs) * (i + 1), peakHeights[i + 1]);
        }
    }

    generateObstacle() {
        this.obstacle.push(new Segment(500, 300, 800, 400));
        this.obstacle.push(new Segment(800, 400, 750, 450));
        this.obstacle.push(new Segment(750, 450, 600, 500));
        this.obstacle.push(new Segment(600, 500, 550, 450));
        this.obstacle.push(new Segment(350, 450, 500, 300));
    }

    /*initEvent() {
        this.canvas.onmousedown = (e) => {
            this.mouseAction(e);
        };
        this.canvas.onmouseup = (e) => {
            this.mousePressed = false;
        };
        this.canvas.onmousemove = (e) => { this.refreshMouseCoord(e); };

        this.canvas.addEventListener('touchstart', (e) => {
            this.refreshTouchCoord(e);
            this.mousePressed = true;
        }, false);

        this.canvas.addEventListener('touchmove', (e) => {
            this.refreshTouchCoord(e);
        }, false);

        this.canvas.addEventListener('touchend', (e) => {
            this.refreshTouchCoord(e);
            this.mousePressed = false;
        }, false);

        window.onresize = (e) => {
            this.resize();
            this.initMap();
        };
    }*/

    draw() {
        /*------------------------------FPS-----------------------------*/
        window.requestAnimationFrame(() => this.draw());

        let now = Math.round(this.FPS * Date.now() / 1000);
        if (now == this.prevTick) return;
        this.prevTick = now;
        /*--------------------------------------------------------------*/

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGround();
        this.drawObstacle();

        for (const orb of this.orbs) {
            orb.move(this.gravity);
            orb.display(this.ctx);
            orb.checkWallCollision();

            for (let i = 0; i < this.segments; i++) {
                orb.checkGroundCollision(this.ground[i]);
            }

            for (let i = 0; i < this.obstacle.length; i++) {
                orb.checkGroundCollision(this.obstacle[i]);
            }
        }
    }

    drawGround() {
        this.ctx.fillStyle = '#7f7f7f';
        this.ctx.beginPath();
        this.ctx.moveTo(this.ground[0].x1, this.ground[0].y1);
        for (const groundSegment of this.ground) {
            this.ctx.lineTo(groundSegment.x2, groundSegment.y2);
        }
        this.ctx.lineTo(this.ground[this.segments - 1].x2, this.canvas.height);
        this.ctx.lineTo(this.ground[0].x1, this.canvas.height);

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawObstacle() {
        if (this.obstacle.length) {
            this.ctx.fillStyle = '#7f7f7f';
            this.ctx.beginPath();
            this.ctx.moveTo(this.obstacle[0].x1, this.obstacle[0].y1);
            for (const obstacleSegment of this.obstacle) {
                this.ctx.lineTo(obstacleSegment.x2, obstacleSegment.y2);
            }

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
}