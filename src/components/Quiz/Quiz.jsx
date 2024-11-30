import React, { useState, useEffect } from "react";
import { useSpring, animated } from '@react-spring/web';
import Confetti from 'react-confetti'; // Import Confetti
import "./Quiz.css";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris"
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4"
  },
  {
    question: "Which language is used for web development?",
    options: ["Java", "C#", "JavaScript", "Python"],
    correctAnswer: "JavaScript"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  }
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timer, setTimer] = useState(30); // 30 seconds per question
  const [progress, setProgress] = useState(0); // For progress bar
  const [celebration, setCelebration] = useState(false); // State for celebration

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTime) => prevTime - 1);
      } else if (timer === 0) {
        handleAnswerClick(""); // Move to next question after time's up
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswerClick = (answer) => {
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else if (answer !== "") {
      setFeedback("Incorrect!");
    }

    // Set progress bar
    setProgress(((currentQuestionIndex + 1) / questions.length) * 100);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(30); // Reset timer for next question
    } else {
      setIsQuizFinished(true);
      if (score === 4) {  // Check if the score is perfect (4/4)
        setCelebration(true); // Trigger celebration
      }
    }

    setSelectedAnswer(""); // Reset selected answer
  };

  const handleOptionChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsQuizFinished(false);
    setSelectedAnswer("");
    setTimer(30); // Reset timer
    setFeedback("");
    setProgress(0); // Reset progress bar
    setCelebration(false); // Reset celebration
  };

  // Animations for various UI elements
  const questionAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-50%)' },
  });

  const feedbackAnimation = useSpring({
    opacity: feedback ? 1 : 0,
    transform: feedback ? "scale(1)" : "scale(0.8)",
    from: { opacity: 0, transform: "scale(0.8)" },
  });

  const timerAnimation = useSpring({
    color: timer <= 10 ? 'red' : 'green', // Red when timer is low
    opacity: timer > 0 ? 1 : 0,
  });

  const scoreAnimation = useSpring({
    opacity: isQuizFinished ? 1 : 0,
    transform: isQuizFinished ? "scale(1)" : "scale(0.5)",
    from: { opacity: 0, transform: "scale(0.5)" },
  });

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        {celebration && <Confetti />}
        {!isQuizFinished ? (
          <>
            <animated.div style={questionAnimation} className="quiz-question">
              <h2>{questions[currentQuestionIndex].question}</h2>
            </animated.div>
            <div className="quiz-options">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  className="option"
                  onClick={() => handleAnswerClick(option)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedAnswer === option ? "#f0f0f0" : "white",
                    transition: "background-color 0.3s ease-in-out",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="radio"
                    id={option}
                    name="quizOption"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={handleOptionChange}
                    style={{ marginRight: "10px" }}
                  />
                  <label htmlFor={option}>{option}</label>
                </div>
              ))}
            </div>
            <animated.div style={feedbackAnimation} className="feedback">
              <p>{feedback}</p>
            </animated.div>
            <animated.div style={timerAnimation} className="timer">
              <p>Time left: {timer}s</p>
            </animated.div>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${progress}%`,
                  height: "10px",
                  backgroundColor: "#4caf50",
                  transition: "width 0.5s ease-in-out",
                }}
              ></div>
            </div>
            <button
              className="next-button"
              onClick={() => handleAnswerClick(selectedAnswer)}
              disabled={!selectedAnswer}
            >
              Next
            </button>
          </>
        ) : (
          <div className="quiz-result">
            <animated.h2 style={scoreAnimation}>Quiz Finished!</animated.h2>
            <animated.p style={scoreAnimation}>
              Your score: {score} / {questions.length}
            </animated.p>
            {score === 4 && (
              <animated.div style={scoreAnimation} className="celebration-message">
                <h3>🎉 Congratulations! Perfect Score! 🎉</h3>
              </animated.div>
            )}
            <button className="restart-button" onClick={restartQuiz}>
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
