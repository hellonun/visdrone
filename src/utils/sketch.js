import * as p5 from 'p5';
import { vid } from "./detect";

let p5canvas;

const sketch = (p) => {
    p.setup = () => {
        p5canvas = p.createCanvas(400, 400);
        // console.log("setting up");
    };

    p.draw = () => {

        p.background(220);
    
        if (vid) {
            p.image(vid.src,0,0); 
        }
        p.ellipse(p.mouseX, p.mouseY, 50);
    };
};

const myp5 = new p5(sketch);

export { sketch }