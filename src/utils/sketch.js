import * as p5 from 'p5';

let p5canvas;
let vid;

const sketch = (p) => {
    p.preload = () => {
    }
    p.setup = () => {
        p5canvas = p.createCanvas(400, 400);
        // console.log("setting up");
    };

    p.draw = () => {
        p.background(220);
        p.ellipse(p.mouseX, p.mouseY, 50);
        // console.log("drawing");
    };
};

const myp5 = new p5(sketch);

export { sketch }