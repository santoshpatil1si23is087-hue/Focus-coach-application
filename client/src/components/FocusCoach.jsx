import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const FocusCoach = ({ isSessionActive, onDistraction, onFocus }) => {
    const webcamRef = useRef(null);
    const wasFocusedRef = useRef(true); // Track previous state
    const [modelLoaded, setModelLoaded] = useState(false);
    const [status, setStatus] = useState("Initializing...");

    // Load Models
    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
                console.log("Loading models...");
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                console.log("Models loaded");
                setModelLoaded(true);
                setStatus("Ready");
            } catch (error) {
                console.error("Error loading models:", error);
                setStatus("Error loading AI models");
            }
        };
        loadModels();
    }, []);

    // Detection Loop
    useEffect(() => {
        let interval;

        const detect = async () => {
            if (!isSessionActive || !webcamRef.current || !webcamRef.current.video || !modelLoaded) return;

            const video = webcamRef.current.video;

            // Check if video is ready
            if (video.readyState !== 4) return;

            try {
                // Detect face with Tiny Face Detector (lightweight)
                const detections = await faceapi.detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions()
                );

                const isFocused = detections.length > 0;

                // Only trigger update if state changed
                // Note: We might want to allow some "flicker" tolerance, but for now strict change is fine.
                if (isFocused !== wasFocusedRef.current) {
                    wasFocusedRef.current = isFocused;

                    if (isFocused) {
                        onFocus();
                        setStatus("Focused 🎯");
                    } else {
                        onDistraction();
                        setStatus("Distracted ⚠️");
                    }
                }
            } catch (err) {
                console.error("Detection error:", err);
            }
        };

        if (isSessionActive && modelLoaded) {
            interval = setInterval(detect, 500); // Check every 500ms
        }

        return () => clearInterval(interval);
    }, [isSessionActive, modelLoaded, onDistraction, onFocus]);

    return (
        <div className="webcam-wrapper">
            <Webcam
                ref={webcamRef}
                audio={false}
                className="webcam-feed"
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user"
                }}
            />

            {/* Overlay Status */}
            <div className="overlay-message" style={{
                backgroundColor: status.includes("Distracted") ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                {status} {status.includes("Distracted") && <span style={{ display: 'block', fontSize: '0.8em' }}>Please look at the screen!</span>}
            </div>

            {!modelLoaded && (
                <div style={{ position: 'absolute', inset: 0, background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Loading AI Models...
                </div>
            )}
        </div>
    );
};

export default FocusCoach;
