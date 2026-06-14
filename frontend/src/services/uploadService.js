import api from "./api";

const uploadService = {
  async getStatus() {
    const response = await api.get("/uploads/status");
    return response.data.data;
  },

  async uploadImages(files) {
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },
};

export default uploadService;
