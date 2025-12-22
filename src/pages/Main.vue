<template>
    <div class="container">
        <div class="news">
            <FeaturedNews :articles="featuredNews"></FeaturedNews>
            <div class="news__main">
                <Categories @categorySelected="categorySelected" />
                <div v-if="loading">Загрузка...</div>
                <div v-else class="news__list">
                    <div v-for="article in filteredArticles" :key="article.id">
                        <NewsCard :article="article" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import NewsCard from "../components/NewsCard.vue";
import Categories from "../components/Categories.vue";
import FeaturedNews from "../components/FeaturedNews.vue";

const selectedCategory = ref(null);
const articles = ref([]);
const search = ref();
const loading = ref(true);

const categoryFilteredArticles = computed(() => {
    if (!selectedCategory.value) {
        console.log(articles.value);
        return articles.value;
    }
    return articles.value.filter(
        (article) => article.category?.id === selectedCategory.value.id
    );
});

const featuredNews = computed(() => {
    const nonZero = articles.value.filter((a) => a.views > 0);

    const sorted = [...nonZero].sort((a, b) => b.views - a.views);

    const topViews = [...new Set(sorted.map((a) => a.views))].slice(0, 5);

    const filtered = nonZero.filter((a) => topViews.includes(a.views));

    return filtered.sort((a, b) => b.views - a.views);
});

const filteredArticles = computed(() => {
    if (!search.value) {
        return categoryFilteredArticles.value;
    }
    return categoryFilteredArticles.value.filter((article) =>
        article.title.toLowerCase().includes(search.value.toLowerCase())
    );
});

onMounted(() => {
    load();
});

async function load() {
    try {
        const response = await fetch(
            "http://localhost:1337/api/articles?populate=*"
        );
        const data = await response.json();
        articles.value = data.data;
        console.log(articles);
        loading.value = false;
    } catch (error) {
        console.error("Ошибка загрузки:", error);
    }
}

function categorySelected(category) {
    selectedCategory.value = category;
}
</script>

<style scoped lang="scss">
.news {
    display: flex;
    gap: 90px;
    padding-top: 40px;

    &__main {
        flex-grow: 1;
    }
}
</style>
