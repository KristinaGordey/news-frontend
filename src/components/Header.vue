<template>
	<header class="header-wrapper">
		 <img
                        src="../assets/logo.svg"
						width="190"
						
                        loading="lazy"
                        alt="Apricot News"
                        class="logo__image"
						
                    />
		<div class="search">
			<input
				class= "input search__input" 
				v-model="search" 
				name="search"
				placeholder="Найти новость"
				>
			</input>
		</div>
		<div v-if="!auth.isAuthenticated" class="header-wrapper__button-group">
			<button class="button" @click="isLoginPopup=true">Вход</button>
			<button class="button" @click="isRegisterPopup=true">Регистрация</button>
		</div>
		<div v-else class="header-wrapper__button-group">
			<button class="button" @click="isAddArticlePopup = true">
				Добавить статью
			</button>
			<button class="button" @click="auth.logout()">
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
.search {
    width: 100%;
	display: flex;
	justify-content: center;
    
    &__input {
		border: 1px solid #f98621;
       	width: 50%;
		&:hover {
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(249, 167, 96, 0.702);
    }
	   


    }
}
.header-wrapper {
	display: flex;
	align-items: center;
	justify-content:space-evenly;
	padding-inline: 96px;
	padding-block: 10px;
	border-bottom: 1px solid ;
	
	&__button-group {
	display: flex;
	gap: 15px;
	}
}
</style>