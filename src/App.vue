<template>
	<div class="container">
		<h1>Новости</h1>
		<div v-if="loading">Загрузка...</div>
		<div v-else>
			<div 
			v-for="article in articles" 
			:key="article.id"
			class="article">
			<h2>{{ article.title }}</h2>
			<span>{{ article.content }}</span>
		</div>
		</div>
	</div>
</template>

<script setup>
import {ref, onMounted } from 'vue'

const articles = ref([])
const loading = ref(true)

onMounted(() => {
	load()
})
async function load() {
	try {
		const response = await fetch('http://localhost:1337/api/articles')
		const data = await response.json()
		articles.value = data.data
		console.log(articles,'e')
		loading.value = false
	} catch (error){
		console.error('Ошибка загрузки:', error)
	}
}
</script>

<style scoped>

</style>
