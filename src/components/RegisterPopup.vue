<template>
	<div class="popup-overlay" @click="$emit('close')">
		<div class="popup-wrapper" @click.stop>
			<h2>Регистрация</h2>
			<input required v-model="username" type="text" placeholder="Логин"></input>
			<input required v-model="email" type="email" placeholder="Почта"></input>
			<input required v-model="password" type="password" placeholder="Пароль"></input>
			<button @click="login">Войти</button>
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
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.popup-wrapper {
		background-color: #fff;
		padding: 24px;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-width: 300px;
		align-items: stretch;

		input {
			padding: 8px;
			border: 1px solid #ccc;
			border-radius: 4px;
			font-size: 14px;
			height: 20px;

			&:focus {
				border-color: #90cdf4;
			}
		}

		button {
			width: 50%;
			align-self: center;
			height: 30px;
			border-radius: 4px;
			border: none;

			&:hover {
				color: #90cdf4;
				border: 2px solid #90cdf4;
			}
		}
	}
</style>