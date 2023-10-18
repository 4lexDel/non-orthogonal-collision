class GameBase {
    constructor(canvas, fullscreen) {
        this.canvas = canvas;
        this.fullscreen = fullscreen;

        this.ctx = this.canvas.getContext("2d");

        // window.onresize = (e) => {
        //     this.resize();
        // };
    }

    resize(func = null) {
        if (this.fullscreen) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
        } else {
            this.canvas.width = this.canvas.offsetParent.clientWidth;
            this.canvas.height = this.canvas.offsetParent.clientHeight;

            // let widthTest = this.canvas.offsetParent.clientWidth;
            // let heightTest = this.canvas.offsetParent.clientHeight;

            // let val = Math.min(widthTest, heightTest);
            // this.canvas.width = val;
            // this.canvas.height = val;
        }

        if (func) {
            func();
        }
    }
}