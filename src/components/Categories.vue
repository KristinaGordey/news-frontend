<template>
	<nav class="categories-menu">
		<div class="categories-menu__item"
			v-for="category in categories"
			:key="category.id"
			:class="{'categories-menu__item--active': selectedCategory && selectedCategory.id === category.id}"
			@click="selectCategory(category)">
			{{ category.name }}
	</div>
	</nav>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const categories = ref([])
const selectedCategory = ref(null)

const emit = defineEmits(['categorySelected'])

onMounted(()=>{
	load()
})

async function load(){
	try {
		const response = await fetch('http://localhost:1337/api/categories')
		const data = await response.json()
		categories.value = data.data
	} catch (error) {
		console.log('Ошибка загрузки категорий: ', error)
	}
}

function selectCategory(category){
	selectedCategory.value = category
	emit('categorySelected', category)
}
</script>

<style scoped lang="scss">
	.categories-menu {
		display: flex;
		gap: 10px;
	
		&__item {
			padding: 6px 12px;
			border-radius: 6px;
		}

		&__item--active {
			background-color: #90cdf4;
			color: white;
		}
	}
</style>