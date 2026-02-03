import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api"; 

export default function Game() {
  const navigate = useNavigate;
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [gameOver, setGameOver] = useState(false);

  //  timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // pindahkan target setiap 2000ms
  useEffect(() => {
    if (gameOver) return;

    const move = setInterval(() => {
      setTarget({
        x: Math.random() * 90,
        y: Math.random() * 80,
      });
    }, 2000);

    return () => clearInterval(move);
  }, [gameOver]);

  const shoot = () => {
    if (gameOver) return;
    setScore(s => s + 10);
  };

  const submitScore = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      `${API_URL}/score`,
      { score },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Score dikirim ke leaderboard!");
    navigate('/leaderboard')
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold mt-5">🎯 Shooter Game</h1>

      <div className="flex gap-6 my-4">
        <div>⏱ Time: {timeLeft}s</div>
        <div>⭐ Score: {score}</div>
        <a href="/leaderboard" target="_blank" rel="noopener noreferrer">Leaderboard</a>
      </div>

      <div className="relative w-[90vw] max-w-xl h-[60vh] bg-gray-800 border rounded overflow-hidden">
        {!gameOver && (
          <button
            onClick={shoot}
            className="absolute w-12 h-12 bg-red-500 rounded-full"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
            }}
          />
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <h2 className="text-2xl mb-2">GAME OVER</h2>
            <p className="mb-4">Final Score: {score}</p>
            <button
              onClick={submitScore}
              className="px-4 py-2 bg-green-600 rounded"
              
            >
              Submit Score
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
