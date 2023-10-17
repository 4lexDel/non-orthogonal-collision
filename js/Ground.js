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