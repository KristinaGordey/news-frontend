<template>
	<div class="news-card">
		<h2 class="news-title">{{ props.article.title }}</h2>
		<div class="news-content">{{ props.article.content }}</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		article: {
			type: Object,
			required: true
		}
	})
</script>

<style lang="scss">
.news-card {
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
	padding: 20px;
	margin-bottom: 24px;
	transition: transform 0.2s ease;
	max-width: 350px;

	&:hover {
		transform: translateY(-4px);
	}

	.news_title {
		font-size: 1.5rem;
		color: #2c3e50;
		margin-bottom: 10px;
	}

	.news-content {
		font-size: 0.95rem;
		color: #333;
		line-height: 1.6;
	}
}
</style>