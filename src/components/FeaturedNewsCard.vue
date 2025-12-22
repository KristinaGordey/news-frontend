<template>
    <div class="news-card featured-news-card glass">
        <div class="news-card__title featured-news-card__title">
            {{ props.article.title }}
        </div>
        <div class="news-card__content featured-news-card__content">
            {{ props.article.content }}
        </div>
        <div class="featured-news-card__footer news-card__footer">
            <div class="featured-news-card__views news-card__views">
                <img
                    src="../assets/views.png"
                    alt="views"
                    class="news-card__views-icon"
                />
                <span class="news-card__views-count">{{
                    props.article.views
                }}</span>
            </div>
            <div
                class="featured-news-card__details news-card__details"
                @click="goToDetails"
            >
                Подробнее..
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
    article: {
        type: Object,
        required: true,
    },
});

function goToDetails() {
    router.push({ name: "news_id", params: { id: props.article.id } });
}
</script>

<style lang="scss">
.featured-news-card {
    min-width: 300px;
    min-height: auto;
}
</style>
