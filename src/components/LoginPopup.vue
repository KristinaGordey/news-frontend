<template>
    <div class="login-popup popup-overlay" @click="$emit('close')">
        <div class="login-popup popup-wrapper" @click.stop>
            <header class="login-popup__header popup__header">
                <h2 class="login-popup__title popup__title">Войти</h2>
            </header>

            <div class="popup-field">
                <input
                    class="input"
                    v-model="username"
                    type="text"
                    placeholder="Логин"
                />
                <span v-if="errors.username" class="error">{{
                    errors.username
                }}</span>
            </div>

            <div class="popup-field">
                <input
                    class="input"
                    v-model="password"
                    type="password"
                    placeholder="Пароль"
                />
                <span v-if="errors.password" class="error">{{
                    errors.password
                }}</span>
            </div>

            <button class="button" @click="login">Войти</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/index";

const auth = useAuthStore();

const username = ref("");
const password = ref("");

const errors = ref({
    username: "",
    password: "",
});

const emit = defineEmits(["close"]);

async function login() {
    errors.value = { username: "", password: "" };

    if (!username.value.trim()) {
        errors.value.username = "Введите логин";
    }
    if (!password.value.trim()) {
        errors.value.password = "Введите пароль";
    }

    if (Object.values(errors.value).some((e) => e)) {
        return;
    }

    try {
        await auth.login({ email: username.value, password: password.value });
        console.log("Успешно");
        emit("close");
    } catch (err) {
        console.error("Ошибка авторизации:", err);
        errors.value.password = "Неверный логин или пароль";
    }
}
</script>

<style scoped lang="scss"></style>
