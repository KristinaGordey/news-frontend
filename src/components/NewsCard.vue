<template>
    <div class="news-card">
        <div
            v-if="auth.isAuthenticated"
            class="news-card__delete"
            @click="deleteArticle"
        >
            x
        </div>
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
                <img
                    src="../assets/views.png"
                    alt="views"
                    class="news-card__views-icon"
                />
                <span class="news-card__views-count">{{
                    props.article.views
                }}</span>
            </div>
            <div class="news-card__details" @click="goToDetails">
                Подробнее..
            </div>
        </div>
    </div>
    <transition name="fade">
        <div v-if="visible" class="error-toast">{{ message }}</div>
    </transition>
</template>

<script setup>
import { useToast } from "../composables/useToast";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/index";
import axios from "axios";

const { message, visible, show } = useToast();
const auth = useAuthStore();
const router = useRouter();
const props = defineProps({
    article: {
        type: Object,
        required: true,
    },
});
const emit = defineEmits(["update"]);

function goToDetails() {
    router.push({ name: "news_id", params: { id: props.article.id } });
}

async function deleteArticle() {
    try {
        await axios.delete(
            `http://localhost:1337/api/articles/${props.article.id}`,
            {
                headers: { Authorization: `Bearer ${auth.token}` },
            }
        );
        emit("update");
    } catch (err) {
        if (err.response?.status === 403) {
            show("Вы не можете удалить чужую статью");
        }
    }
}
</script>

<style lang="scss">
.news-card {
    display: flex;
    gap: 15px;
    flex-direction: column;
    align-content: space-between;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.425);
    padding: 20px;
    margin-bottom: 24px;
    transition: transform 0.2s ease;
    min-height: 200px;

    &:hover {
        transform: translateY(-4px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(249, 167, 96, 0.702);
    }

    &__delete {
        // position: absolute;
        display: flex;
        justify-content: flex-end;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }

    &__image {
        border-radius: 8px;
        max-height: 300px;
        width: 100%;
        object-fit: contain;
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
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    &__details {
        color: #333;
        text-align: right;
        font-size: small;
        cursor: pointer;

        &:hover {
            color: #f98621;
        }
    }
}
.error-toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #f56565; // красный фон
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    font-size: 0.9rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
