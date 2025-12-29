<template>
    <div class="container">
        <div class="news">
            <FeaturedNews :articles="featuredNews" />

            <div class="news__main">
                <SortSelector @sortChanged="sortChanged"></SortSelector>
                <Categories @categorySelected="categorySelected" />
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
import SortSelector from "../components/SortSelector.vue";

const articlesStore = useArticlesStore();

const filteredArticles = computed(() => articlesStore.filteredArticles);
const featuredNews = computed(() => articlesStore.featuredNews);
const loading = computed(() => articlesStore.loading);

const selectedCategory = ref("Все");
const search = ref("");
const selectedSort = ref("desc");
watch(search, (val) => {
    articlesStore.setSearch(val);
});

onMounted(() => {
    articlesStore.load();
    articlesStore.loadPopular();
});

function categorySelected(category) {
    selectedCategory.value = category;
    articlesStore.selectCategory(category);
}
function sortChanged(sort) {
    selectedSort.value = sort;
    console.log("Sort", sort);
    articlesStore.selectSort(sort);
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

    &__filters {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }
}
</style>
