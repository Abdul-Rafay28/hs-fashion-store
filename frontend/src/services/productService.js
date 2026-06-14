import api from "./api";

const productService = {
  async getProducts(params = {}) {
    const response = await api.get("/products", { params });
    return response.data.data;
  },

  async searchProducts(params = {}) {
    const response = await api.get("/products/search", { params });
    return response.data.data;
  },

  async getFeatured(limit = 4) {
    const response = await api.get("/products/featured", {
      params: { limit },
    });
    return response.data.data;
  },

  async getNewArrivals(limit = 4) {
    const response = await api.get("/products/new-arrivals", {
      params: { limit },
    });
    return response.data.data;
  },

  async getProductDetails(slug) {
    const response = await api.get(`/products/${slug}`);
    return response.data.data;
  },

  async getProductById(id) {
    const response = await api.get(`/products/id/${id}`);
    return response.data.data;
  },

  async getAdminStats() {
    const response = await api.get("/products/admin/stats");
    return response.data.data;
  },

  async getSuggestions(query) {
    const response = await api.get("/products/suggestions", {
      params: { q: query },
    });
    return response.data.data;
  },

  async createProduct(payload) {
    const response = await api.post("/products", payload);
    return response.data.data;
  },

  async updateProduct(id, payload) {
    const response = await api.put(`/products/${id}`, payload);
    return response.data.data;
  },

  async deleteProduct(id) {
    await api.delete(`/products/${id}`);
  },
};

export default productService;

