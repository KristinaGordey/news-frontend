<template>
	<header class="header-wrapper">
		<h1>Новости</h1>
		<div class="header-wrapper__button-group">
			<button @click="isLoginPopup=true">Вход</button>
			<button>Регистрация</button>
		</div>
	</header>
	<LoginPopup 
		v-if="isLoginPopup"
		@close="isLoginPopup=false"
	/>
</template>

<script setup>
import {ref} from 'vue'
import LoginPopup from './LoginPopup.vue';

const isLoginPopup = ref(false)

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