// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./ObjectDetection.scss"
import { drawRect } from "../utilities/detection";
import { useSpeechSynthesis } from "react-speech-kit";

const ObjectDetection = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const { speak, speaking, cancel } = useSpeechSynthesis();
    const [loading, setLoading] = useState(true);

    // Main function
    const runCoco = async() => {
        const net = await cocossd.load();
        console.log("Model loaded.");
        setInterval(() => {
            detect(net);
        }, 10);
    };

    const detect = async(net) => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            setLoading(false);
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const obj = await net.detect(video);

            const ctx = canvasRef.current.getContext("2d");
            drawRect(obj, ctx, speak, speaking, cancel);
        }
    };

    useEffect(() => { runCoco() }, []);

    return ( < div className = "ObjectDetection" >
        <
        div className = "webcam-div" >
        <
        Webcam ref = { webcamRef }
        muted = { true }
        style = {
            {
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 640,
                height: 480,
            }
        }
        />

        <
        canvas ref = { canvasRef }
        style = {
            {
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 8,
                width: 640,
                height: 480,
            }
        }
        /> </div > {
            loading &&
            <
            h3 > Loading < /h3>
        } < /div>
    );
}

export default ObjectDetection;