/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 403 error (Forbidden)
      toast.error(
        "You are not authorized to perform this action. Try logging in again."
      );
      window.location.href = "/auth/login";
      // Optionally, you can also perform other actions like redirecting to a login page
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  return api.post("/auth/login", { email, password });
};

export const forgotPassword = async (email: string) => {
  return api.get("/auth/get_code/" + email);
};

export const verifyOTP = async (email: string, code: string) => {
  return api.post("/auth/verify_code", { email, code });
};

export const resetPassword = async (
  email: string,
  password: string,
  code: string
) => {
  return api.put("/auth/reset_password", {
    email,
    newPassword: password,
    code: Number(code),
  });
};

export const useOnLoad = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // const [, setCategories] = useRecoilState(categoriesState);

  const onLoad = async () => {
    setLoading(true);
    console.log("loading");
    // load initial data
  };

  return {
    loading,
    error,
    onLoad,
  };
};
