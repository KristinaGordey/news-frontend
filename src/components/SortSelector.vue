<template>
    <div class="data-sort">
        <select
            class="data-sort__select"
            id="sort"
            v-model="selected"
            @change="$emit('sortChanged', selected)"
        >
            <option value="asc">Дата ↑ (по возрастанию)</option>
            <option value="desc">Дата ↓ (по убыванию)</option>
        </select>
    </div>
</template>

<script setup>
import { ref } from "vue";
const selected = ref("desc");
</script>

<style scoped lang="scss">
.data-sort {
    text-align: end;
    &__select {
        border-radius: 15px;
        border: 1px solid;
        padding: 5px;
        font-size: smaller;
        &:hover {
            border-color: var(--accent-color);
            transition-duration: 0.2s;
        }
    }
}
</style>
