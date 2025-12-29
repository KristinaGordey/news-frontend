// store/articles.js
import { defineStore } from "pinia";

export const useArticlesStore = defineStore("articles", {
    state: () => ({
        articles: [],
        popularArticles: [],
        loading: false,
        page: 1,
        pageSize: 3,
        pageCount: 0,
        total: 0,
        selectedSort: "desc",
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
                    a.title
                        .toLowerCase()
                        .includes(state.searchQuery.toLowerCase())
                );
            }

            return result;
        },
        featuredNews: (state) => state.popularArticles,
    },

    actions: {
        async load() {
            this.loading = true;
            try {
                const params = new URLSearchParams();

                params.append("populate", "*");
                params.append("pagination[page]", this.page);
                params.append("pagination[pageSize]", this.pageSize);
                params.append("sort", `publishedAt:${this.selectedSort}`);

                if (this.selectedCategory) {
                    params.append(
                        "filters[category][id][$eq]",
                        this.selectedCategory.id
                    );
                }

                if (this.searchQuery) {
                    params.append(
                        "filters[title][$containsi]",
                        this.searchQuery
                    );
                }

                const res = await fetch(
                    `http://localhost:1337/api/articles?${params.toString()}`
                );

                const data = await res.json();

                this.articles = data.data;
                this.pageCount = data.meta.pagination.pageCount;
                this.total = data.meta.pagination.total;
            } catch (e) {
                console.error("Ошибка загрузки:", e);
            } finally {
                this.loading = false;
            }
        },
        async loadPopular() {
            const res = await fetch(
                "http://localhost:1337/api/articles/popular"
            );
            const data = await res.json();
            this.popularArticles = data.data;
        },
        setPage(newPage) {
            this.page = newPage;
            this.load();
        },
        setSearch(query) {
            this.searchQuery = query;
            this.page = 1;
            this.load();
        },

        selectCategory(category) {
            this.selectedCategory = category;
            this.page = 1;
            this.load();
        },
        selectSort(sort) {
            this.selectedSort = sort;
            this.load();
        },
        removeArticle(deletedId) {
            this.articles = this.articles.filter((a) => a.id !== deletedId);
        },
    },
});
