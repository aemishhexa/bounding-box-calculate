import React, { useState, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ObjectDetection = () => {
    const [image, setImage] = useState(null);
    const canvasRef = useRef(null);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error('No file uploaded');
            return;
        }

        const img = new Image();
        img.onload = async function () {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Load the COCO-SSD model
            const model = await cocoSsd.load();

            // Perform object detection
            const predictions = await model.detect(img);

            // Log bounding boxes to the console
            predictions.forEach((prediction) => {
                const [x, y, width, height] = prediction.bbox;
                console.log(
                    `Bounding Box - x: ${x}, y: ${y}, width: ${width}, height: ${height}`,
                );
            });

            // Optionally, draw bounding boxes on the canvas
            drawBoundingBoxes(predictions, ctx);
        };
        img.src = URL.createObjectURL(file);
        setImage(img);
    };

    const drawBoundingBoxes = (predictions, ctx) => {
        predictions.forEach((prediction) => {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, width, height);
            ctx.font = '18px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText(prediction.class, x, y > 10 ? y - 5 : 10);
        });
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default ObjectDetection;
