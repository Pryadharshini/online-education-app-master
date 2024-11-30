import React, { useState, useEffect, useRef } from "react";
import * as handTrack from "handtrackjs";

const Quiz = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Reference for the canvas element

  const quizQuestion = "What is the capital of France?";
  const options = ["1. Paris", "2. London", "3. Berlin", "4. Madrid"];
  const correctAnswer = 1;

  // Start the quiz and video feed
  const startQuiz = async () => {
    setQuizStarted(true);
    const model = await handTrack.load();

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Start video feed
    handTrack.startVideo(video).then((status) => {
      if (status) {
        detectHands(model, video, ctx);
      } else {
        console.error("Please enable your camera.");
      }
    });
  };

  // Detect hands and process gestures
  const detectHands = (model, video, ctx) => {
    const detectLoop = async () => {
      const predictions = await model.detect(video);
      model.renderPredictions(predictions, canvasRef.current, ctx, video); // Fix here: use canvasRef.current

      if (predictions.length > 0) {
        const selected = processGesture(predictions[0].bbox);
        if (selected && selected !== selectedOption) {
          setSelectedOption(selected);
          checkAnswer(selected);
        }
      }

      requestAnimationFrame(detectLoop);
    };

    detectLoop();
  };

  // Process gesture based on bounding box
  const processGesture = (bbox) => {
    const [x, y, width, height] = bbox;

    if (height < 100) return 1; // Small height, Option 1
    if (height >= 100 && height < 150) return 2; // Medium height, Option 2
    if (height >= 150 && height < 200) return 3; // Large height, Option 3
    if (height >= 200) return 4; // Very large height, Option 4

    return null;
  };

  // Check if the selected option is correct
  const checkAnswer = (selected) => {
    if (selected === correctAnswer) {
      setFeedback("Correct Answer!");
    } else {
      setFeedback("Wrong Answer, Try Again!");
    }
  };

  // Stop camera and cleanup
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setQuizStarted(false);
  };

  useEffect(() => {
    return () => stopCamera(); // Cleanup on component unmount
  }, []);

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        <button onClick={startQuiz}>Start Quiz</button>
      ) : (
        <>
          <h2 className="question">{quizQuestion}</h2>
          <div className="options">
            {options.map((option, index) => (
              <div
                key={index}
                className={`option ${selectedOption === index + 1 ? "selected" : ""}`}
              >
                {option}
              </div>
            ))}
          </div>
          <div className="feedback">{feedback}</div>
          <button onClick={stopCamera}>Stop Quiz</button>

          <video
            ref={videoRef}
            id="video"
            autoPlay
            playsInline
            muted
            width="640"
            height="480"
          />
          <canvas ref={canvasRef} id="canvas" width="640" height="480" />
        </>
      )}
    </div>
  );
};

export default Quiz;
