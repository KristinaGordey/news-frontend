import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: null,
        user: null,
        status: "",
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        authStatus: (state) => state.status,
        currentUser: (state) => state.user,
    },

    actions: {
		initAuth() {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user");

			if (!token || !user) return;

			try {
				this.token = token;
				this.user = JSON.parse(user);
				axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
				this.status = "success";
			} catch (e) {
				this.logout();
			}
		},
        async login({ email, password }) {
            this.status = "loading";
            try {
                const response = await axios.post(
                    "http://localhost:1337/api/auth/local",
                    {
                        identifier: email,
                        password: password,
                    }
                );

                const token = response.data.jwt;
                const user = response.data.user;

                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;

                this.token = token;
                this.user = user;
				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(user));
                this.status = "success";
                console.log("user:", user);
            } catch (error) {
                console.log("AUTH ERROR:", error);
                this.status = "error";
                this.token = null;
                this.user = null;
                throw error;
            }
        },

        async register({ username, email, password }) {
            this.status = "loading";
            try {
                const response = await axios.post(
                    "http://localhost:1337/api/auth/local/register",
                    {
                        username,
                        email,
                        password,
                    }
                );

                const token = response.data.jwt;
                const user = response.data.user;

                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;

                this.token = token;
                this.user = user;
				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(user));
                this.status = "success";
            } catch (error) {
                console.error("REGISTRATION ERROR:", error.response?.data);
                this.status = "error";
                throw error;
            }
        },
        logout() {
            this.status = "";
            this.token = null;
            this.user = null;
			localStorage.removeItem("token");
    		localStorage.removeItem("user");
            delete axios.defaults.headers.common["Authorization"];
        },
    },
});
