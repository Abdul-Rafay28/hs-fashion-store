import api from "./api";

const authService = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data.data;
  },

  async logout() {
    await api.post("/auth/logout");
  },

  async getProfile() {
    const response = await api.get("/auth/me");
    return response.data.data;
  },
};

export default authService;

