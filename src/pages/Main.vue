<template>
	<div class="container">
		<div class="search">
			<input
				class="search__input" 
				v-model="search" 
				placeholder="Найти новость">
			</input>
		</div>
		<Categories
			@categorySelected="categorySelected"
		/>
		<div v-if="loading">Загрузка...</div>
		<div v-else class="news-wrapper">
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
const search = ref()
const loading = ref(true)

const categoryFilteredArticles = computed(() => {
	if(!selectedCategory.value){
		return articles.value
	}
	return articles.value.filter(article => article.category?.id === selectedCategory.value.id)
})

const filteredArticles = computed(()=>{
	if(!search.value){
		return categoryFilteredArticles.value
	}
	return categoryFilteredArticles.value.filter(article => article.title.toLowerCase().includes(search.value.toLowerCase()))
})

onMounted(() => {
	load()
})

async function load() {
	try {
		const response = await fetch('http://localhost:1337/api/articles?populate=*')
		const data = await response.json()
		articles.value = data.data
		console.log(articles)
		loading.value = false
	} catch (error){
		console.error('Ошибка загрузки:', error)
	}
}

function categorySelected(category){
	selectedCategory.value = category
}
</script>

<style scoped lang="scss">
.news-wrapper {
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	justify-content: flex-start;
}
.search {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-bottom: 20px;

	&__input {
		width: 50%;
		height: 30px;
		border-radius: 8px;
		border: 1px solid #90cdf4;
		
		&::placeholder {
			color: #90cdf4;
		}

		&:focus {
			outline: none;
			box-shadow: none;
		}
	}
}
</style>
