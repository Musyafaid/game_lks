<template>
  <div
    class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4"
  >
    <h1 class="text-3xl font-bold">✈️ Plane Shooter</h1>

    <!-- INFO -->
    <div class="flex gap-6 text-lg">
      <div>⏱ Time: {{ timeLeft }}</div>
      <div>⭐ Score: {{ score }}</div>
    </div>

    <!-- INSTRUKSI -->
    <div class="text-sm text-gray-300 text-center">
      <p>⬅️➡️⬆️⬇️ : Gerak</p>
      <p>␣ Space : Tembak</p>
    </div>

    <!-- GAME AREA -->
    <div
      class="relative w-[600px] h-[400px] bg-black border-4 border-gray-600 overflow-hidden"
    >
      <div
        class="absolute w-10 h-10 bg-no-repeat bg-contain"
        :style="{
          left: player.x + 'px',
          top: player.y + 'px',
          backgroundImage: `url(${planeImg})`,
        }"
      ></div>

      <!-- BULLETS -->
      <div
        v-for="(b, i) in bullets"
        :key="i"
        class="absolute w-2 h-4 bg-yellow-400"
        :style="{ left: b.x + 'px', top: b.y + 'px' }"
      ></div>

      <!-- ENEMY -->
      <div
        v-for="(e, i) in enemies"
        :key="i"
        class="absolute w-10 h-10 text-center"
        :style="{ left: e.x + 'px', top: e.y + 'px' }"
      >
        👾
      </div>

      <!-- GAME OVER -->
      <div
        v-if="gameOver"
        class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-3xl"
      >
        Game Over
      </div>
    </div>

    <button
      v-if="gameOver"
      @click="submitScore"
      class="px-6 py-2 bg-green-600 rounded"
    >
      Submit Score
    </button>

    <button @click="goLeaderboard" class="px-6 py-2 bg-blue-600 rounded">
      Leaderboard
    </button>

    <button @click="logout" class="px-6 py-2 bg-red-600 rounded">Logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import planeImg from "../assets/plane.png";

const API_URL = "http://127.0.0.1:8000/api";

const timeLeft = ref(30);
const score = ref(0);
const gameOver = ref(false);

const player = ref({ x: 280, y: 330 });
const bullets = ref([]);
const enemies = ref([]);

let timer, enemyInterval, gameLoop;

// ⏱ TIMER
const startTimer = () => {
  timer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) endGame();
  }, 1000);
};

// 👾 SPAWN MUSUH
const spawnEnemy = () => {
  enemies.value.push({
    x: Math.random() * 560,
    y: 0,
  });
};

// 🎮 GAME LOOP
const updateGame = () => {
  // gerak peluru
  bullets.value.forEach((b) => (b.y -= 8));
  bullets.value = bullets.value.filter((b) => b.y > -10);

  // gerak musuh
  enemies.value.forEach((e) => (e.y += 3));
  enemies.value = enemies.value.filter((e) => e.y < 400);

  // collision
  enemies.value.forEach((e, ei) => {
    bullets.value.forEach((b, bi) => {
      if (b.x < e.x + 30 && b.x + 5 > e.x && b.y < e.y + 30 && b.y + 10 > e.y) {
        enemies.value.splice(ei, 1);
        bullets.value.splice(bi, 1);
        score.value += 10;
      }
    });
  });
};

// ⌨️ KONTROL
const handleKey = (e) => {
  if (gameOver.value) return;

  switch (e.code) {
    case "ArrowLeft":
      player.value.x = Math.max(0, player.value.x - 15);
      break;
    case "ArrowRight":
      player.value.x = Math.min(560, player.value.x + 15);
      break;
    case "ArrowUp":
      player.value.y = Math.max(0, player.value.y - 15);
      break;
    case "ArrowDown":
      player.value.y = Math.min(360, player.value.y + 15);
      break;
    case "Space":
      bullets.value.push({
        x: player.value.x + 18,
        y: player.value.y,
      });
      break;
  }
};

const endGame = () => {
  gameOver.value = true;
  clearInterval(timer);
  clearInterval(enemyInterval);
  clearInterval(gameLoop);
};

const submitScore = async () => {
  const token = localStorage.getItem("token");
  await axios.post(
    `${API_URL}/score`,
    { score: score.value },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  alert("Score terkirim!");
};

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

const goLeaderboard = () => {
  window.location.href = "/leaderboard";
};

onMounted(() => {
  startTimer();
  enemyInterval = setInterval(spawnEnemy, 1500);
  gameLoop = setInterval(updateGame, 50);
  window.addEventListener("keydown", handleKey);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKey);
  endGame();
});
</script>
