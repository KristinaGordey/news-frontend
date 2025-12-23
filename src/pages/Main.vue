<template>
    <div class="container">
        <div class="news">
            <FeaturedNews :articles="featuredNews" />

            <div class="news__main">
                <Categories @categorySelected="categorySelected" />
                <Paginator></Paginator>
                <div v-if="loading">Загрузка...</div>
                <div v-else class="news__list">
                    <div v-for="article in filteredArticles" :key="article.id">
                        <NewsCard :article="article" @update="updateArticles" />
                    </div>
                </div>
                <Paginator></Paginator>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import NewsCard from "../components/NewsCard.vue";
import Categories from "../components/Categories.vue";
import FeaturedNews from "../components/FeaturedNews.vue";
import Paginator from "../components/Paginator.vue";
import { useArticlesStore } from "../store/articles.js";

const articlesStore = useArticlesStore();

const filteredArticles = computed(() => articlesStore.filteredArticles);
const featuredNews = computed(() => articlesStore.featuredNews);
const loading = computed(() => articlesStore.loading);

const search = ref("");
watch(search, (val) => {
    articlesStore.setSearch(val);
});

onMounted(() => {
    articlesStore.load();
});

function categorySelected(category) {
    articlesStore.selectCategory(category);
}

const updateArticles = (deletedId) => {
    articlesStore.removeArticle(deletedId);
};
</script>

<style scoped lang="scss">
.news {
    display: flex;
    gap: 90px;

    &__main {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
}
</style>
