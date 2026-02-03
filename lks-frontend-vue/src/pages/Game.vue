<template>
  <div
    class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4"
  >
    <h1 class="text-3xl font-bold">🎯 Shooter Game</h1>

    <div class="flex gap-6 text-lg">
      <div>⏱ Time: {{ timeLeft }}</div>
      <div>⭐ Score: {{ score }}</div>
    </div>

    <div
      class="relative w-[600px] h-[400px] bg-gray-800 border-4 border-gray-600 rounded overflow-hidden"
    >
      <div
        v-if="!gameOver && showTarget"
        class="absolute w-12 h-12 bg-red-500 rounded-full cursor-pointer"
        :style="{
          left: target.x + '%',
          top: target.y + '%',
        }"
        @click="shoot"
      ></div>

      <div
        v-if="gameOver"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-3xl"
      >
        Game Over
      </div>
    </div>

    <button
      v-if="gameOver"
      @click="submitScore"
      class="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-lg"
    >
      Submit Score
    </button>

    <button
      @click="goLeaderboard"
      class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-lg"
    >
      Leaderboard
    </button>

    <button
      @click="logout"
      class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-lg"
    >
      Logout
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// timer
const timeLeft = ref(7); 
const score = ref(0);
const gameOver = ref(false);

const target = ref({ x: 50, y: 50 });
const showTarget = ref(true);

let timerInterval = null;
let targetInterval = null;
let hideTimeout = null;

// TIMER 30 DETIK
const startTimer = () => {
  timerInterval = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      gameOver.value = true;
      clearInterval(timerInterval);
      clearInterval(targetInterval);
    }
  }, 1000);
};

// TARGET PINDAH + HILANG
const startTarget = () => {
  targetInterval = setInterval(() => {
    showTarget.value = true;
    target.value = {
      x: Math.random() * 90,
      y: Math.random() * 80,
    };

    hideTimeout = setTimeout(() => {
      showTarget.value = false;
    }, 1000);
  }, 2000);
};

// TEMBAK
const shoot = () => {
  if (gameOver.value) return;
  score.value += 10;
  showTarget.value = false;
};

const checkAuth = () => {
  const token = localStorage.getItem("token")

  if (!token) {
    alert("Silakan login terlebih dahulu")
    window.location.href = "/login"
    return false
  }

  return true
}

checkAuth();

const submitScore = async () => {
  const token = localStorage.getItem("token")

  

  console.log("TOKEN:", token);
  console.log("SCORE:", score.value);

 

  try {
    const res = await axios.post(
      `${API_URL}/score`,
      { score: score.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    console.log("API RESPONSE:", res.data);
    alert("Score berhasil dikirim ke leaderboard!");
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err);
    alert("Gagal submit score");
  }
};

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

const goLeaderboard = () => {
  window.location.href = "/leaderboard"
}


onMounted(() => {
  startTimer();
  startTarget();
});

onUnmounted(() => {
  clearInterval(timerInterval);
  clearInterval(targetInterval);
  clearTimeout(hideTimeout);
});
</script>

<style scoped></style>
