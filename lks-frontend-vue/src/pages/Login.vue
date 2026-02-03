<template>
  <div class="h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="w-80 space-y-4">
      <h1 class="text-2xl font-bold text-center">Login</h1>

      <input v-model="username" placeholder="Username" class="w-full p-2 text-black" />
      <input v-model="password" type="password" placeholder="Password" class="w-full p-2 text-black" />

      <button @click="login" class="w-full bg-blue-600 py-2 rounded">
        Login
      </button>

      <p class="text-red-400 text-sm" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/login", {
      username: username.value,
      password: password.value,
    });

    localStorage.setItem("token", res.data.token);
    router.push("/");
  } catch {
    error.value = "Login gagal";
  }
};
</script>
