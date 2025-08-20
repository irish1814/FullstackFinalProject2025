import { http } from "../http.jsx";

export const UsersService = {
    async getUsers() {
        return http("/users/all", {
        token: localStorage.getItem("token"),
        });
    },

    async getUserById(userId) {
        return http(`/users/${userId}`, {
        method: "GET",
        token: localStorage.getItem("token"),
        });
    },

    async deleteUser(userId) {
        return http(`/users/${userId}`, {
        method: "DELETE",
        token: localStorage.getItem("token"),
        });
    },
};
