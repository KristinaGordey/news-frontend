<template>
	<header class="header-wrapper">
		<h1>Новости</h1>
		<div v-if="!auth.isAuthenticated" class="header-wrapper__button-group">
			<button @click="isLoginPopup=true">Вход</button>
			<button @click="isRegisterPopup=true">Регистрация</button>
		</div>
		<div v-else class="header-wrapper__button-group">
			<button @click="isAddArticlePopup = true">
				Добавить статью
			</button>
			<button @click="auth.logout()">
				Выйти
			</button>
		</div>
	</header>
	<LoginPopup 
		v-if="isLoginPopup"
		@close="isLoginPopup=false"
	/>
	<RegisterPopup
		v-if="isRegisterPopup"
		@close="isRegisterPopup=false"
	/>
	<AddArticlePopup
		v-if="isAddArticlePopup"
		@close="isAddArticlePopup = false"
	/>
</template>

<script setup>
import {ref} from 'vue'
import LoginPopup from './LoginPopup.vue';
import RegisterPopup from './RegisterPopup.vue';
import AddArticlePopup from './AddArticlePopup.vue';
import { useAuthStore } from '../store/index'

const auth = useAuthStore()

const isLoginPopup = ref(false)
const isRegisterPopup = ref(false)
const isAddArticlePopup = ref(false)

</script>
<style scoped lang="scss">
.header-wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;

	&__button-group {
	display: flex;
	gap: 10px;
	
		button{
			border: none;
			height: 30px;
			border-radius: 4px;	
			background-color: #fff;
			cursor: pointer;

			&:hover{
				background-color: #90cdf4;
				color: #fff;
			}
		}
	}
}
</style>