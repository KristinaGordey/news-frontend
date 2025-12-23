// store/articles.js
import { defineStore } from "pinia";

export const useArticlesStore = defineStore("articles", {
  state: () => ({
    articles: [],
    loading: false,
    selectedCategory: null,
    searchQuery: "",
  }),

  getters: {
    filteredArticles: (state) => {
      let result = state.articles;

      if (state.selectedCategory) {
        result = result.filter(
          (a) => a.category?.id === state.selectedCategory.id
        );
      }

      if (state.searchQuery) {
        result = result.filter((a) =>
          a.title.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }

      return result;
    },

    featuredNews: (state) => {
      const nonZero = state.articles.filter((a) => a.views > 0);
      const sorted = [...nonZero].sort((a, b) => b.views - a.views);
      const topViews = [...new Set(sorted.map((a) => a.views))].slice(0, 5);
      return nonZero
        .filter((a) => topViews.includes(a.views))
        .sort((a, b) => b.views - a.views);
    },
  },

  actions: {
    async load() {
      this.loading = true;
      try {
        const res = await fetch("http://localhost:1337/api/articles?populate=*");
        const data = await res.json();
        this.articles = data.data;
      } catch (e) {
        console.error("Ошибка загрузки:", e);
      } finally {
        this.loading = false;
      }
    },

    setSearch(query) {
      this.searchQuery = query;
    },

    selectCategory(category) {
      this.selectedCategory = category;
    },

    removeArticle(deletedId) {
      this.articles = this.articles.filter((a) => a.id !== deletedId);
    },
  },
});
