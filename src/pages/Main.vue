<template>
	<div class="container">
		<h1>Новости</h1>
		<Categories
			@categorySelected="categorySelected"/>
		<div v-if="loading">Загрузка...</div>
		<div v-else>
			<div 
			v-for="article in filteredArticles" 
			:key="article.id">
			<NewsCard
				:article="article"/>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, onMounted, computed } from 'vue'
import NewsCard from '../components/NewsCard.vue'
import Categories from '../components/Categories.vue'

const selectedCategory = ref(null)
const articles = ref([])

const loading = ref(true)

const filteredArticles = computed(() => {
	if(!selectedCategory.value){
		return articles.value
	}
	return articles.value.filter(article => article.category?.id === selectedCategory.value.id)
})

onMounted(() => {
	load()
})

async function load() {
	try {
		const response = await fetch('http://localhost:1337/api/articles?populate=category')
		const data = await response.json()
		articles.value = data.data
		loading.value = false
	} catch (error){
		console.error('Ошибка загрузки:', error)
	}
}

function categorySelected(category){
	selectedCategory.value = category
}



</script>

<style scoped>

</style>
