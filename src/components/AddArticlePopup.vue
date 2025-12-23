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
            ></textarea>
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
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../store/index";

const auth = useAuthStore();

const emit = defineEmits(["close"]);

const categories = ref([]);
const title = ref("");
const content = ref("");
const category = ref("");

onMounted(() => {
    load();
});

async function load() {
    try {
        const response = await axios.get(
            "http://localhost:1337/api/categories"
        );
        categories.value = response.data.data;
    } catch (error) {
        console.log("Ошибка загрузки категорий: ", error);
    }
}
async function createArticle() {
    try {
        console.log("user id:", auth.currentUser);
        const response = await axios.post(
            "http://localhost:1337/api/articles",
            {
                data: {
                    title: title.value,
                    content: content.value,
                    slug: "",
                    category: {
                        connect: [{ id: Number(category.value) }],
                    },
                    publishedDate: new Date().toISOString(),
                    user: {
                        connect: [{ id: Number(auth.currentUser.id) }],
                    },
                },
            }
        );

        console.log("Article created:", response.data);

        emit("close");
    } catch (err) {
        console.error("Ошибка создания статьи:", err.response?.data || err);
    }
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
