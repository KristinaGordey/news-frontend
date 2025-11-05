<template>
	<div class="news-card">
		<div class="news-card__title">{{ props.article.title }}</div>
		<div class="news-card__content">{{ props.article.content }}</div>
		<img
			v-if="props.article.coverImage?.url"
			:src="'http://localhost:1337' + props.article.coverImage.url"
			alt="Обложка"
			class="news-card__image"
		/>
		<div class="news-card__footer">
			<div class="news-card__views">
				<img src="../assets/views.png" alt="views" class="news-card__views-icon" />
				<span class="news-card__views-count">{{ props.article.views }}</span>
			</div>
			<div 
				class="news-card__details"
				@click="goToDetails"
			>
				Подробнее..
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const props = defineProps({
	article: {
		type: Object,
		required: true
	}
})

function goToDetails(){
	router.push({ name: 'news_id', params: { id: props.article.id}})
}
</script>

<style lang="scss">
.news-card {
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
	padding: 20px;
	margin-bottom: 24px;
	transition: transform 0.2s ease;
	max-width: 400px;

	&:hover {
		transform: translateY(-4px);
	}

	&__image {
		width: 100%;
		border-radius: 8px;
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
	}

	&__views {
		display: flex;
		align-items: center;
	}

	&__views-icon {
		width: 16px;
		height: auto;
	}

	&__views-count {
		margin-left: 4px;
	}

	&__title {
		font-size: 1rem;
		font-weight: 700;
		color: #000000;
		margin-bottom: 10px;
	}

	&__content {
		font-size: 0.95rem;
		color: #333;
		line-height: 1.6;
		margin-bottom: 16px;
	}

	&__details {
		color: #333;
		text-align: right;
		font-size: small;
		cursor: pointer;

		&:hover {
			color: #90cdf4;
		}
	}
}
</style>
