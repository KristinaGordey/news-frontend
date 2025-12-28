<template>
    <div class="container">
        <div v-if="article" class="news-detail">
            <div @click="goBack" class="news-detail__go-back">← Вернуться</div>
            <div>Категория: {{ article.category.name }}</div>
            <header class="news-detail__header">
                <div class="news-detail__header-top">
                    <h2 class="news-detail__title">
                        {{ article.title }}
                    </h2>

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
                </div>
                <div class="news-detail__header-bottom">
                    <p class="news-detail__author">
                        Автор статьи: {{ article.user.username }}
                    </p>
                    <div class="news-card__views">
                        <img
                            src="../assets/views.png"
                            alt="views"
                            class="news-card__views-icon"
                        />
                        <span class="news-card__views-count">{{
                            article.views
                        }}</span>
                    </div>
                </div>
            </header>

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

onMounted(() => {
    load();
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
        &-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid;
            padding-bottom: 20px;
        }
        &-bottom {
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
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
