<template>
    <div class="popup-overlay" @click="$emit('close')">
        <div class="popup-wrapper" @click.stop>
            <header class="add-article-popup__header popup__header">
                <h2 class="add-article-popup__title popup__title">
                    Добавить новость
                </h2>
            </header>
            <input
                class="input"
                v-model="title"
                type="text"
                placeholder="Заголовок"
                required
            />
            <textarea
                class="add-article-popup__textarea"
                v-model="content"
                placeholder="Текст новости"
                required
            />
            <input type="file" @change="onFileChange" accept="image/*" />

            <select
                class="add-article-popup__select-category"
                v-model="category"
                required
            >
                <option value="" disabled selected>Выберите категорию</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                </option>
            </select>

            <button class="button" @click="createArticle">Создать</button>
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

const emit = defineEmits(["close"]);

const title = ref("");
const content = ref("");
const category = ref("");
const file = ref(null);

async function createArticle() {
    try {
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

        await axios.post(
            "http://localhost:1337/api/articles",
            {
                data: {
                    title: title.value,
                    content: content.value,
                    publishedDate: new Date().toISOString(),
                    category: { connect: [{ id: Number(category.value) }] },
                    user: { connect: [{ id: Number(auth.currentUser.id) }] },
                    coverImage: imageId ? imageId : null,
                },
            },
            {
                headers: { Authorization: `Bearer ${auth.token}` },
            }
        );

        await articlesStore.load();
        emit("close");
    } catch (error) {
        console.error("Ошибка создания статьи:", error.response?.data || error);
    }
}

async function uploadFile() {
    if (!file.value) return null;

    const formData = new FormData();
    formData.append("files", file.value);

    const response = await axios.post(
        "http://localhost:1337/api/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data[0].id;
}

function onFileChange(e) {
    const selected = e.target.files[0];
    if (selected) file.value = selected;
}
</script>

<style scoped lang="scss">
.add-article-popup {
    &__textarea {
        padding: 15px;
        border: 1px solid;
        border-radius: 8px;
        font-size: 14px;
    }
    &__select-category {
        padding: 5px 15px;
        border: 1px solid;
        border-radius: 8px;
        font-size: 14px;
    }
}
</style>
