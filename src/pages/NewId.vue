<template>
	<div @click="goBack">
		← Вернуться 
	</div>
	<div v-if="article">
		<h3>{{ article.title }}</h3>
		<div>{{ article.content }}</div>
		<img v-if="article.coverImage"
			:src="'http://localhost:1337' + article.coverImage.url"
			alt="Обложка"
			class="news-card__image"
		/>
	</div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import router from '../router'
const props = defineProps({
	id: {
		type: String,
		required: true
	}
})

const article = ref(null)

onMounted(()=>{
	load()
})

async function load(){
	try{
		const response = await fetch(`http://localhost:1337/api/articles/${props.id}?populate=*`)
		const data = await response.json()
		article.value = data.data
	}catch(error){
		console.error('Ошибка загрузки:', error)
	}
}
function goBack(){
	router.back()
}
</script>

<style scoped lang="scss">

</style>