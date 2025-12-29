<template>
    <div class="data-sort">
        <select
            class="data-sort__select select"
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
        font-size: smaller;
    }
}
</style>
