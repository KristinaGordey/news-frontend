<template>
    <div class="popup-overlay" @click="$emit('close')">
        <div class="popup-wrapper" @click.stop>
			<h2>{{ props.article ? "Редактировать новость" : "Добавить новость" }}</h2>
            <input
                v-model="title"
                type="text"
                placeholder="Заголовок"
                required
            />
            <textarea
                v-model="content"
                placeholder="Текст новости"
                required
			/>
            <input
				type="file"
				@change="onFileChange"
				accept="image/*"
            />
            <select v-model="category" required>
                <option disabled value="">Выберите категорию</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                </option>
            </select>
			<div v-if="coverImagePreview">
				<p>Текущее изображение:</p>
				<img :src="coverImagePreview" alt="Cover Image" style="max-width: 100%; max-height: 200px;" />
			</div>

            <button @click="createArticle"> {{ props.article ? "Сохранить" : "Создать" }}</button>
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
  } 
})
const emit = defineEmits(["close"]);

const title = ref(props.article?.title || "") 
const content = ref(props.article?.content || "") 
const category = ref(props.article?.category?.id || null) 
const file = ref(null)
const coverImagePreview = ref(
  props.article?.coverImage?.url
    ? `http://localhost:1337${props.article.coverImage.url}`
    : null
);


async function createArticle() {
  try {
    let imageId = null
    if (file.value) {
      const formData = new FormData()
      formData.append("files", file.value)
      const response = await axios.post("http://localhost:1337/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      imageId = response.data[0].id
    }

    const payload = {
      data: {
        title: title.value,
        content: content.value,
        category: { connect: [{ id: Number(category.value) }] },
        coverImage: imageId ? imageId : props.article?.coverImage?.id || null,
      },
    }

    if (props.article) {
      await axios.put(`http://localhost:1337/api/articles/${props.article.id}`, payload, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
    } else {
      payload.data.publishedDate = new Date().toISOString()
      payload.data.user = { connect: [{ id: Number(auth.currentUser.id) }] }
      await axios.post("http://localhost:1337/api/articles", payload, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
    }

    await articlesStore.load()
    emit("close")
  } catch (error) {
    console.error("Ошибка сохранения статьи:", error.response?.data || error)
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
.popup-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.popup-wrapper {
    background-color: #fff;
    padding: 24px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 350px;

    input,
    textarea {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: none;
    }

    button {
        width: 50%;
        align-self: center;
        height: 30px;
        border-radius: 4px;
        border: none;
        cursor: pointer;

        &:hover {
            color: #90cdf4;
            border: 2px solid #90cdf4;
        }
    }
}
</style>
