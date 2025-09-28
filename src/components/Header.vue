<template>
	<header class="header-wrapper">
		<h1>Новости</h1>
		<div class="header-wrapper__button-group">
			<button>Вход</button>
			<button>Регистрация</button>
		</div>
	</header>
</template>

<script setup></script>
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
		}
	}
}
</style>