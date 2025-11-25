<template>
  <div class="popup-overlay" @click="$emit('close')">
    <div class="popup-wrapper" @click.stop>
      <h2>Добавить новость</h2>

      <input v-model="title" type="text" placeholder="Заголовок" required>
      <textarea v-model="content" placeholder="Текст новости" required></textarea>
      <select v-model="category" required>
        <option disabled value="">Выберите категорию</option>
        <option 
          v-for="cat in categories" 
          :key="cat.id" 
          :value="cat.id">
            {{ cat.name }}
		    </option>
      </select>

      <button @click="createArticle">Создать</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const emit = defineEmits(['close'])

const categories = ref([])
const title = ref('')
const content = ref('')
const category = ref(null)

onMounted(()=>{
	load()
})

async function load(){
	try {
		const response = await axios.get('http://localhost:1337/api/categories')
		categories.value = response.data.data
	} catch (error) {
		console.log('Ошибка загрузки категорий: ', error)
	}
}
async function createArticle() {
  try {
    const response = await axios.post('http://localhost:1337/api/articles', {
      data: {
        title: title.value,
        content: content.value,
        category: {
          connect: [{ id: Number(category.value) }]
        },
        publishedDate: new Date().toISOString()
      }
    })

    console.log("Article created:", response.data)
    emit('close')

  } catch (err) {
    console.error("Ошибка создания статьи:", err.response?.data || err)
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
