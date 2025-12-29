<template>
    <div class="popup-overlay" @click="$emit('close')">
        <div class="register-popup popup-wrapper" @click.stop>
            <header class="register-popup__header popup__header">
                <h2 class="register-popup__title popup__title">Регистрация</h2>
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
                    v-model="email"
                    type="email"
                    placeholder="Почта"
                />
                <span v-if="errors.email" class="error">{{
                    errors.email
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

            <button class="button" @click="register">Зарегистрироваться</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/index";

const auth = useAuthStore();

const username = ref("");
const password = ref("");
const email = ref("");

const errors = ref({
    username: "",
    email: "",
    password: "",
});

const emit = defineEmits(["close"]);

async function register() {
    errors.value = { username: "", email: "", password: "" };

    if (!username.value.trim()) {
        errors.value.username = "Введите логин";
    }
    if (!email.value.trim()) {
        errors.value.email = "Введите почту";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.value.email = "Введите корректный email";
    }
    if (!password.value.trim()) {
        errors.value.password = "Введите пароль";
    } else if (password.value.length < 6) {
        errors.value.password = "Пароль должен быть не менее 6 символов";
    }

    if (Object.values(errors.value).some((e) => e)) {
        return;
    }

    try {
        await auth.register({
            username: username.value,
            email: email.value,
            password: password.value,
        });
        console.log("Успешно");
        emit("close");
    } catch (err) {
        console.error("Ошибка регистрации:", err);
        errors.value.password = "Ошибка регистрации";
    }
}
</script>

<style scoped lang="scss">
.error {
    color: red;
    font-size: 12px;
}
</style>
