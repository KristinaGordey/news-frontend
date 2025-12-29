<template>
    <div class="news-card glass">
        <div class="news-card__header">
            <div class="news-card__title">
                {{ props.article.title }}
            </div>

            <div class="news-card__actions">
                <img
                    v-if="auth.isAuthenticated"
                    src="../assets/pencil.svg"
                    alt="Редактировать"
                    class="news-card__edit"
                    @click="tryEditArticle"
                />

                <div
                    v-if="auth.isAuthenticated"
                    class="news-card__delete"
                    @click="deleteArticle"
                >
                    ×
                </div>
            </div>
        </div>

        <div class="news-card__content">
            {{ props.article.excerpt || props.article.content }}
        </div>
        <img
            v-if="props.article.coverImage?.url"
            :src="'http://localhost:1337' + props.article.coverImage.url"
            alt="Обложка"
            class="news-card__image"
        />
        <div class="news-card__footer">
            <div class="news-card__meta">
                <div class="news-card__publish-date">
                    {{
                        new Date(article.publishedDate).toLocaleDateString(
                            "ru-RU",
                            {
                                day: "numeric",
                                month: "numeric",
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
            </div>

            <div class="news-card__details" @click="goToDetails">
                Подробнее..
            </div>
        </div>
    </div>

    <AddArticlePopup
        v-if="editArticlePopup"
        :article="props.article"
        @close="editArticlePopup = false"
        @updated="emit('update', props.article.id)"
    />

    <transition name="fade">
        <div v-if="visible" class="error-toast">{{ message }}</div>
    </transition>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "../composables/useToast";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/index";
import axios from "axios";
import AddArticlePopup from "./AddArticlePopup.vue";

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

const editArticlePopup = ref(false);

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
        emit("update", props.article.id);
    } catch (err) {
        if (err.response?.status === 403) {
            show("Вы не можете удалить чужую статью");
        }
    }
}
function tryEditArticle() {
  if (
    props.article.users_permissions_user?.id === auth.user?.id ||
    auth.user?.role?.name === "Editor"
  ) {
    editArticlePopup.value = true;
  } else {
    show("Вы не можете редактировать не свою статью");
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
        transition-duration: 0.2s;
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

    &__actions {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 2px;
    }

    &__edit {
        width: 11px;
        height: 11px;
        cursor: pointer;
        opacity: 0.7;

        &:hover {
            opacity: 1;
        }
    }

    &__image {
        border-radius: 8px;
        max-height: 300px;
        width: 100%;
        object-fit: contain;
    }

    &__footer {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: small;
    }
    &__meta {
        display: flex;
        justify-content: space-between;
    }
    &__publish-date {
    }

    &__views {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    &__views-icon {
        width: 16px;
        height: auto;
    }

    &__views-count {
    }

    &__title {
        font-size: 1.2rem;
        font-weight: 700;
        color: #000;
        margin: 0;
        flex: 1;
        display: flex;
        align-items: center;
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

        cursor: pointer;

        &:hover {
            color: var(--accent-color);
            transition-duration: 0.2s;
        }
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 10px;
    }

    &__delete {
        cursor: pointer;
        font-weight: bold;
        font-size: 1.2rem;
        flex-shrink: 0;
        line-height: 1;
        color: gray;
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
