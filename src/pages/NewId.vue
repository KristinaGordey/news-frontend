<template>
    <div class="container">
        <div v-if="article" class="news-detail">
            <div @click="goBack" class="news-detail__go-back">← Вернуться</div>
            <header class="news-detail__header">
                <h2 class="news-detail__title">{{ article.title }}</h2>
                <p>
                    {{
                        new Date(article.publishedDate).toLocaleDateString(
                            "ru-RU",
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            }
                        )
                    }}
                </p>
            </header>
            <p v-if="article?.user" class="news-detail__author">
                Автор статьи: {{ article.user.username }}
            </p>
            <div class="news-detail__content">{{ article.content }}</div>
            <img
                v-if="article.coverImage"
                :src="'http://localhost:1337' + article.coverImage.url"
                alt="Обложка"
                class="news-detail__image"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "../router";
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

const article = ref(null);

onMounted(async () => {
    await load();
    await increaseViews();
});

async function load() {
    try {
        const response = await fetch(
            `http://localhost:1337/api/articles/${props.id}?populate=*`
        );
        const data = await response.json();
        article.value = data.data;
    } catch (error) {
        console.error("Ошибка загрузки:", error);
    }
}

async function increaseViews() {
    try {
        await fetch(
            `http://localhost:1337/api/articles/${props.id}/view`,
            { method: "POST" }
        );
    } catch (e) {
        console.error("Ошибка увеличения просмотров", e);
    }
}

function goBack() {
    router.back();
}
</script>

<style scoped lang="scss">
.news-detail {
    display: flex;
    flex-direction: column;
    gap: 30px;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid;
        padding-bottom: 20px;
    }

    &__content {
        font-size: 1.2em;
    }

    &__image {
        border-radius: 8px;
        max-height: 700px;
        width: 100%;
        object-fit: contain;
    }

    &__go-back:hover {
        color: var(--accent-color);
        transition-duration: 0.2s;
    }
}
</style>
