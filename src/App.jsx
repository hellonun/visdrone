import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import Loader from "./components/loader";
import ButtonHandler from "./components/btn-handler";
// import { detectImage, detectVideo } from "./utils/detect";
import { detectVideo } from "./utils/detect";

// import { sketch } from "./utils/sketch";
import Sketch from "react-p5";

import "./style/App.css";

const App = () => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape

  // references
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const p5Video = useRef(null);

  // model configs
  const modelName = "yolov5n";
  const classThreshold = 0.5;

  // p5 stuff
  const setup = (p5, canvasParentRef) => {
    let p5Cnv = p5.createCanvas(640, 640).parent(canvasParentRef)
    // let vid = p5.createVideo("https://player.vimeo.com/progressive_redirect/playback/703953872/rendition/540p/file.mp4?loc=external&signature=c31792e363314faf98119a3beac10454b4b36578c6e59a254803d03fbe44dfad")
    p5.background(220); 
    canvasRef.current = p5Cnv.elt;
    
    p5Video.current = p5.createVideo(`${window.location.origin}/small.mp4`, vidLoad)
  }
  
  const draw = p5 => {
    // p5.image(videoRef.current,0,0); 
    // console.log(videoRef.current.src == "");
    // console.log(videoRef.current);
    if (videoRef.current && videoRef.current.src != "") {
      // console.log(p5Video.current);
      p5.image(p5Video.current,0,0);
      if (p5.frameCount % 60 == 0) {
        console.log(videoRef.current);
        detectVideo(videoRef.current, model, classThreshold, canvasRef.current)
      }
    }

    p5.ellipse(p5.mouseX, p5.mouseY, 100, 100);

  }

  const vidLoad = () => {
    console.log("yo");
    // p5Video.loop();
    p5Video.current.elt.autoplay = true;
    p5Video.current.elt.muted = true;
    videoRef.current = p5Video.current.elt;
    // p5Video.current.elt.onplay = () => {detectVideo(videoRef.current, model, classThreshold, canvasRef.current)}
    p5Video.current.hide()
    p5Video.current.size(640, 640)
  }

  useEffect(() => {
    tf.ready().then(async () => {
      const yolov5 = await tf.loadGraphModel(
        `${window.location.origin}/${modelName}_web_model/model.json`,
        {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions }); // set loading fractions
          },
        }
      ); // load model

      // warming up model
      const dummyInput = tf.ones(yolov5.inputs[0].shape);
      const warmupResult = await yolov5.executeAsync(dummyInput);
      tf.dispose(warmupResult); // cleanup memory
      tf.dispose(dummyInput); // cleanup memory

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: yolov5,
        inputShape: yolov5.inputs[0].shape,
      }); // set model & input shape
      console.log(yolov5.inputs[0].shape);
    });



  }, []);


  return (

    <div className="App">
      {loading.loading && <Loader>Loading model... {(loading.progress * 100).toFixed(2)}%</Loader>}
      <div className="header">
        {/* <h1>📷 YOLOv5 Live Detection App</h1>
        <p>
          YOLOv5 live detection application on browser powered by <code>tensorflow.js</code>
        </p>
        <p>
          Serving : <code className="code">{modelName}</code>
        </p> */}
      </div>


      <div className="content">
        {/* <img
          src="#"
          ref={imageRef}
          onLoad={() => detectImage(imageRef.current, model, classThreshold, canvasRef.current)}
        /> */}
        <video
          autoPlay
          muted
          ref={cameraRef}
          onPlay={() => detectVideo(cameraRef.current, model, classThreshold, canvasRef.current)}
        />
        <video
          autoPlay
          muted
          // ref={videoRef}
          onPlay={() => detectVideo(videoRef.current, model, classThreshold, canvasRef.current)}
        />
        {/* <canvas width={model.inputShape[1]} height={model.inputShape[2]} ref={canvasRef} /> */}
        <Sketch setup={setup} draw={draw} />
      </div>

      <ButtonHandler cameraRef={cameraRef} videoRef={videoRef} />

      
    </div>

  );
};

export default App;
