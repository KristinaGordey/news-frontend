<template>
	<div class="login-popup popup-overlay" @click="$emit('close')">
		<div class="login-popup popup-wrapper" @click.stop>
			<header class="login-popup__header popup__header">
				<h2 class="login-popup__title popup__title">Войти</h2>
			</header>
			<input class="input" required v-model="username" type="text" placeholder="Логин"></input>
			<input class="input" required v-model="password" type="password" placeholder="Пароль"></input>
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

const emit = defineEmits(['close'])

async function login() {
  try {
    await auth.login({ email: username.value, password: password.value })
    console.log('Успешно')
	emit('close')
  } catch (err) {
    console.error('Ошибка авторизации:', err)
  }
}
</script>

<style scoped lang="scss">

</style>