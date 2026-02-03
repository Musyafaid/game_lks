<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="flex justify-between mb-4">
      <h1 class="text-2xl font-bold">Leaderboard</h1>
      <button @click="logout" class="bg-red-600 px-4 py-2 rounded">
        Logout
      </button>
      <button
        @click="goBack"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-lg"
      >
        Back
      </button>
    </div>

    <ul>
      <li v-for="(u, i) in data" :key="i" class="bg-gray-800 p-2 mb-2 rounded">
        {{ i + 1 }}. {{ u.username }} — {{ u.score }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const data = ref([]);

onMounted(async () => {
  if (!localStorage.getItem("token")) router.push("/");

  const res = await axios.get("http://127.0.0.1:8000/api/leaderboard", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  data.value = res.data;
});

const goBack = () => {
  window.location.href = "/"
}

const logout = async () => {
  try {
    await axios.post(
      "http://127.0.0.1:8000/api/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  } finally {
    localStorage.removeItem("token");
    router.push("/");
  }
};
</script>
