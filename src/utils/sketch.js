import * as p5 from 'p5';
import { vid, p5boxes } from "./detect";
import labels from "./labels.json";


let p5canvas;
let newvid;
let state = 0;
let p5classThreshold = 0.5;
let p5boxes_data, p5scores_data, p5classes_data, p5ratios;
let colors; 

const sketch = (p) => {
    p.setup = () => {
        p5canvas = p.createCanvas(1080, 1920);
         colors = new Colors();

        // console.log("setting up");

    };

    p.draw = () => {

        p.background(220);
        if (vid) {
            if (state == 0) {
                let blobUrl = vid.src;
                newvid = p.createVideo([blobUrl]);
                newvid.style.display = 'block';
                newvid.autoplay = true;
                newvid.play();
                newvid.hide();
            } else {
                p.clear();
                p.image(newvid, 0, 0);
                if (p5boxes) {
                    p5boxes_data = p5boxes[0];
                    p5scores_data = p5boxes[1];
                    p5classes_data = p5boxes[2];
                    p5ratios =  p5boxes[3]; 

                    for (let i = 0; i < p5scores_data.length; ++i) {
                        // filter based on class threshold
                        if (p5scores_data[i] > p5classThreshold) {
                            const klass = labels[p5classes_data[i]];
                            const color = colors.get(p5classes_data[i]);
                            const score = (p5scores_data[i] * 100).toFixed(1);

                            let [x1, y1, x2, y2] = p5boxes_data.slice(i * 4, (i + 1) * 4);
                            x1 *= p.width * p5ratios[0];
                            x2 *= p.width * p5ratios[0];
                            y1 *= p.height * p5ratios[1];
                            y2 *= p.height * p5ratios[1];
                            const width = x2 - x1;
                            const height = y2 - y1;

                            // draw box.
                            //   ctx.fillStyle = Colors.hexToRgba(color, 0.2);
                            // ctx.fillRect(x1, y1, width, height);

                            p.fill(255);
                            p.rect(x1, y1, width, height);

                            //   // draw border box.
                            //   ctx.strokeStyle = color;
                            //   ctx.lineWidth = Math.max(Math.min(ctx.canvas.width, ctx.canvas.height) / 200, 2.5);
                            //   ctx.strokeRect(x1, y1, width, height);

                            //   // Draw the label background.
                            //   ctx.fillStyle = color;
                            //   const textWidth = ctx.measureText(klass + " - " + score + "%").width;
                            //   const textHeight = parseInt(font, 10); // base 10
                            //   const yText = y1 - (textHeight + ctx.lineWidth);
                            //   ctx.fillRect(
                            //     x1 - 1,
                            //     yText < 0 ? 0 : yText, // handle overflow label box
                            //     textWidth + ctx.lineWidth,
                            //     textHeight + ctx.lineWidth
                            //   );

                            //   // Draw labels
                            //   ctx.fillStyle = "#ffffff";
                            //   ctx.fillText(klass + " - " + score + "%", x1 - 1, yText < 0 ? 0 : yText);
                        }
                    }


                }








            }
            state = 1;
            // vid.style('display', 'block');
            // vid.autoplay(true);
        } else {
            state = 0;
        }
        p.ellipse(p.mouseX, p.mouseY, 50);


    };
};



class Colors {
    // ultralytics color palette https://ultralytics.com/
    constructor() {
        this.palette = [
            "#FF3838",
            "#FF9D97",
            "#FF701F",
            "#FFB21D",
            "#CFD231",
            "#48F90A",
            "#92CC17",
            "#3DDB86",
            "#1A9334",
            "#00D4BB",
            "#2C99A8",
            "#00C2FF",
            "#344593",
            "#6473FF",
            "#0018EC",
            "#8438FF",
            "#520085",
            "#CB38FF",
            "#FF95C8",
            "#FF37C7",
        ];
        this.n = this.palette.length;
    }

    get = (i) => this.palette[Math.floor(i) % this.n];

    static hexToRgba = (hex, alpha) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `rgba(${[parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)].join(
                ", "
            )}, ${alpha})`
            : null;
    };
}



const myp5 = new p5(sketch);

export { sketch }


