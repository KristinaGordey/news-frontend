<template>
    <div class="paginator">
        <button class="button" @click="prevPage" :disabled="page === 1">
            Назад
        </button>
        <span>Страница {{ page }} из {{ pageCount }} (всего {{ total }})</span>
        <button class="button" @click="nextPage" :disabled="page === pageCount">
            Вперёд
        </button>
    </div>
</template>

<script setup>
import { useArticlesStore } from "../store/articles.js";
import { computed } from "vue";

const store = useArticlesStore();

const page = computed(() => store.page);
const pageCount = computed(() => store.pageCount);
const total = computed(() => store.total);

function nextPage() {
    if (page.value < pageCount.value) {
        store.setPage(page.value + 1);
    }
}
function prevPage() {
    if (page.value > 1) {
        store.setPage(page.value - 1);
    }
}
</script>

<style scoped>
.paginator {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
}
</style>
