import { ref, onMounted } from "vue";
import axios from "axios";

export function useCategories() {
    const categories = ref([]);
    const loading = ref(false);

    const loadCategories = async () => {
        loading.value = true;
        const res = await axios.get("http://localhost:1337/api/categories");
        categories.value = res.data.data;
        loading.value = false;
    };

    onMounted(loadCategories);

    return {
        categories,
        loading,
        loadCategories,
    };
}
