import api from "./api";

const login = async (email, password) => {
  const response = await api.post("/admin/login", {
    email,
    password,
  });

  return response.data;
};

const getProfile = async () => {
  const response = await api.get("/admin/profile");

  return response.data;
};

const authService = {
  login,
  getProfile,
};

export default authService;
