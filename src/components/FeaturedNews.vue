<template>
    <div class="featured-news">
        <header class="featured-news__header">
            <h2 class="featured-news__title">Популярное</h2>
        </header>
        <div v-for="article in props.articles" :key="article.id">
            <FeaturedNewsCard :article="article" />
        </div>
    </div>
</template>
<script setup>
import FeaturedNewsCard from "./FeaturedNewsCard.vue";

const props = defineProps({
    articles: {
        type: Array,
        required: true,
    },
});
</script>

<style lang="scss">
.featured-news {
    &__title {
        padding-bottom: 20px;
    }
}
</style>
