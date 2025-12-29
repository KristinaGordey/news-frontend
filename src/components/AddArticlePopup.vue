<template>
    <div class="popup-overlay" @click="$emit('close')">
        <div class="add-article-popup popup-wrapper" @click.stop>
            <header class="popup__header">
                <h2 class="popup__title">
                    {{
                        props.article
                            ? "Редактировать новость"
                            : "Добавить новость"
                    }}
                </h2>
            </header>

            <div class="add-article-popup__body">
                <!-- Заголовок -->
                <div class="add-article-popup__body-field">
                    <input
                        class="input"
                        v-model="title"
                        type="text"
                        placeholder="Заголовок"
                    />
                    <span v-if="errors.title" class="error">{{
                        errors.title
                    }}</span>
                </div>

                <div class="add-article-popup__body-field">
                    <textarea
                        class="textarea add-article-popup__textarea"
                        v-model="excerpt"
                        placeholder="Краткое содержание"
                    ></textarea>
                    <span v-if="errors.excerpt" class="error">{{
                        errors.excerpt
                    }}</span>
                </div>
                <!-- Краткое содержание -->
                <div class="add-article-popup__body-field">
                    <textarea
                        class="textarea add-article-popup__textarea"
                        v-model="content"
                        placeholder="Текст новости"
                    ></textarea>
                    <span v-if="errors.content" class="error">{{
                        errors.content
                    }}</span>
                </div>
                <!-- Текст новости -->
                <div class="add-article-popup__body-field">
                    <select v-model="category" class="select">
                        <option disabled value="">Выберите категорию</option>
                        <option
                            v-for="cat in categories"
                            :key="cat.id"
                            :value="cat.id"
                        >
                            {{ cat.name }}
                        </option>
                    </select>
                    <span v-if="errors.category" class="error">{{
                        errors.category
                    }}</span>
                </div>
                <!-- Категория -->

                <input type="file" @change="onFileChange" accept="image/*" />
                <div v-if="coverImagePreview">
                    <p>Текущее изображение:</p>
                    <img
                        :src="coverImagePreview"
                        alt="Cover Image"
                        style="max-width: 100%; max-height: 200px"
                    />
                </div>
            </div>
            <button class="button" @click="createArticle">
                {{ props.article ? "Сохранить" : "Создать" }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../store/index";
import { useArticlesStore } from "../store/articles";
import { useCategories } from "../composables/useCategories";

const auth = useAuthStore();
const articlesStore = useArticlesStore();
const { categories } = useCategories();

const props = defineProps({
    article: {
        type: Object,
        required: false,
    },
});
const emit = defineEmits(["close"]);

const title = ref(props.article?.title || "");
const excerpt = ref(props.article?.excerpt || "");
const content = ref(props.article?.content || "");
const category = ref(props.article?.category?.id || null);
const file = ref(null);
const coverImagePreview = ref(
    props.article?.coverImage?.url
        ? `http://localhost:1337${props.article.coverImage.url}`
        : null
);
const errors = ref({
    title: "",
    excerpt: "",
    content: "",
    category: "",
});
async function createArticle() {
    errors.value = { title: "", excerpt: "", content: "", category: "" };

    if (!title.value.trim()) errors.value.title = "Введите заголовок";
    if (!excerpt.value.trim())
        errors.value.excerpt = "Введите краткое содержание";
    if (!content.value.trim()) errors.value.content = "Введите текст новости";
    if (!category.value) errors.value.category = "Выберите категорию";

    if (Object.values(errors.value).some((e) => e)) {
        return;
    }
    try {
        console.log(categories);
        console.log(category);
        let imageId = null;
        if (file.value) {
            const formData = new FormData();
            formData.append("files", file.value);
            const response = await axios.post(
                "http://localhost:1337/api/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );
            imageId = response.data[0].id;
        }

        const payload = {
            data: {
                title: title.value,
                content: content.value,
                excerpt: excerpt.value,
                category: { connect: [{ id: Number(category.value) }] },
                coverImage: imageId
                    ? imageId
                    : props.article?.coverImage?.id || null,
            },
        };
        console.log(props.article);
        if (props.article) {
            await axios.put(
                `http://localhost:1337/api/articles/${props.article.id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );
        } else {
            payload.data.publishedDate = new Date().toISOString();
            payload.data.users_permissions_user = {
                connect: [{ id: Number(auth.currentUser.id) }],
            };

            await axios.post("http://localhost:1337/api/articles", payload, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
        }

        await articlesStore.load();

        emit("close");
    } catch (error) {
        console.error(
            "Ошибка сохранения статьи:",
            error.response?.data || error
        );
    }
}

function onFileChange(e) {
    const selected = e.target.files[0];
    if (selected) {
        file.value = selected;
        coverImagePreview.value = URL.createObjectURL(selected);
    }
}
</script>

<style scoped lang="scss">
.error {
    color: red;
    font-size: 12px;
}
.add-article-popup {
    &__body-field {
        display: flex;
        flex-direction: column;
    }
    &__body {
        display: flex;
        flex-direction: column;
        gap: 30px;
        overflow-y: auto;
        padding-inline: 20px;
    }
    &__textarea {
        flex-shrink: 0;
    }
    &__select-category {
        padding: 5px 15px;
        border: 1px solid;
        border-radius: 8px;
        font-size: 14px;
    }
}
</style>
