import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token);
    onLogin();
  };

  console.log("TOKEN:", localStorage.getItem("token"));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded text-white w-72">
        <h2 className="text-xl mb-4">Login</h2>
        <input
          className="w-full mb-2 p-2 rounded text-black"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 rounded text-black"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login} className="w-full bg-blue-600 py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}
