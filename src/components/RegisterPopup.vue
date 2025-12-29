<template>
	<div class="popup-overlay" @click="$emit('close')">
		<div class="register-popup popup-wrapper" @click.stop>
			<header class="register-popup__header popup__header">
				<h2 class="register-popup__title popup__title">Регистрация</h2>
			</header>
			<input class="input" required v-model="username" type="text" placeholder="Логин"></input>
			<input class="input"  required v-model="email" type="email" placeholder="Почта"></input>
			<input class="input"  required v-model="password" type="password" placeholder="Пароль"></input>
			<button class="button" @click="login">Войти</button>
		</div>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/index'

const auth = useAuthStore()

const username = ref('')
const password = ref('')
const email = ref('')

const emit = defineEmits(['close'])

async function login() {
  try {
    await auth.register({ username:username.value, email: email.value, password: password.value })
    console.log('Успешно')
	emit('close')
  } catch (err) {
    console.error('Ошибка регистрации:', err)
  }
}
</script>

<style scoped lang="scss">
	
</style>