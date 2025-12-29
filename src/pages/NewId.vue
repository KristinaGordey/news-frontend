<template>
    <div class="container">
        <div v-if="article" class="news-detail">
            <div @click="goBack" class="news-detail__go-back">← Вернуться</div>

            <header class="news-detail__header">
                <div class="news-detail__header-top news-detail__header-row">
                    <div class="news-detail__category">
                        Категория: {{ article.category.name }}
                    </div>
                    <div class="news-detail__reading-time">
                        Время чтения: {{ article.readingTime }} мин.
                    </div>
                </div>
                <div class="news-detail__header-middle news-detail__header-row">
                    <h2 class="news-detail__title">
                        {{ article.title }}
                    </h2>

                    <div>
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
                        {{
                            new Date(article.publishedDate).toLocaleTimeString(
                                "ru-RU",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )
                        }}
                    </div>
                </div>
                <div class="news-detail__header-bottom news-detail__header-row">
                    <p
                        v-if="article?.users_permissions_user"
                        class="news-detail__author"
                    >
                        Автор статьи:
                        {{ article.users_permissions_user.username }}
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

            <div
                v-html="marked(article.content)"
                class="news-detail__content"
            ></div>
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
import { marked } from "marked";
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
        await fetch(`http://localhost:1337/api/articles/${props.id}/view`, {
            method: "POST",
        });
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
        flex-direction: column;
        gap: 20px;
        &-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        &-middle {
            border-bottom: 1px solid;
            padding-bottom: 20px;
        }
    }

    &__content {
        font-size: 1.2em;
        padding: 15px;
        white-space: pre-wrap;
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
