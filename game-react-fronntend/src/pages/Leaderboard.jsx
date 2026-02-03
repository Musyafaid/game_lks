import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchLeaderboard = async () => {
      try {
        const leaderboardRes = await axios.get(
          `${API_URL}/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setLeaderboard(leaderboardRes.data);

        const myRankRes = await axios.get(
          `${API_URL}/my-rank`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setMyRank(myRankRes.data);
      } catch (err) {
        console.error(err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🏆 Leaderboard</h1>

      {myRank && (
        <div className="bg-yellow-600/20 border border-yellow-500 p-4 rounded-lg mb-6 text-center">
          <p className="text-lg font-semibold">🎯 Rank Kamu</p>
          <p>
            #{myRank.rank} — {myRank.username} ({myRank.score} pts)
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Player</th>
              <th className="p-3 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-gray-700 ${
                  myRank?.user_id === item.user_id
                    ? "bg-green-700/30 font-bold"
                    : ""
                }`}
              >
                <td className="p-3">#{index + 1}</td>
                <td className="p-3">{item.username}</td>
                <td className="p-3">{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
