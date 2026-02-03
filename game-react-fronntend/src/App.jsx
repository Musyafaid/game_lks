import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import Game from "./pages/Game";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/" element={<Game />} />

      </Routes>
    </BrowserRouter>
  );
}
