/* eslint-disable @typescript-eslint/no-explicit-any */
import { rolesState } from "@/atoms";
import { getErrorMessage } from "@/lib/utils";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

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
      toast.error(
        "You are not authorized to perform this action. Try logging in again."
      );
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  return api.post("/auth/login", { email, password });
};

export const verifyLogin = async (
  email: string,
  password: string,
  activationCode: number
) => {
  return api.post("/auth/verify-login", { email, password, activationCode });
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
  const [, setRoles] = useRecoilState(rolesState);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await getRoles();
      setRoles(data.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const onLoad = async () => {
    setLoading(true);
    console.log("loading");
    // load initial data
    await fetchRoles();
  };

  return {
    loading,
    error,
    onLoad,
  };
};

export const getAllInspectors = async () => {
  return api.get("/inspectors/all");
};

export const inviteInspector = async (email: string) => {
  return api.post("/inspectors/invite", { email });
};

export const getAllInspections = async () => {
  return api.get("/inspections/plans/all");
};

export const getInspectionInfo = async (id: string) => {
  return api.get(`/inspections/categories/plan-id/${id}`);
};

export const addFeedback = async (planId: string, reviewMessage: string) => {
  return api.put("/inspections/review", { planId, reviewMessage });
};

export const setupRMBStaff = async (data: any) => {
  return api.post("/rmb-staff", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const inviteRMBStaff = async (email: string) => {
  return api.post("/rmb-staff/invite", { email });
};

export const getAllRMBStaff = async () => {
  return api.get("/rmb-staff/all");
};

export const getRoles = async () => {
  return api.get("/rmb-staff/roles/all");
};

export const createRole = async (data: any) => {
  return api.post("/rmb-staff/roles/create", data);
};

export const updateRole = async (data: any) => {
  return api.put(
    `/rmb-staff/assign-roles?rmbRoleId=${data.rmbRoleId}&rmbStaffId=${data.rmbStaffId}`
  );
};

export const getAnalytics = async () => {
  return api.get("/analytics/rmb");
};

export const takeAction = async (
  planId: string,
  action: "APPROVE" | "REJECT"
) => {
  return api.patch(
    `/inspections/reports/take-action?action=${action}`,
    { planId }
  );
};

export const getProfile = async () => {
  // return api.get("/auth/get-profile");
  /* Simulate the response from the server */
  return {
    data: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      role: "Inspector",
      province: "Province 1",
      district: "District 1",
      phoneNumber: "1234567890",
      profilePic:
        "http://res.cloudinary.com/dclubb6gk/image/upload/v1730190590/kabstore/products/original-0c14504bd291054d76548cb015dff89a_1730190590128.png",
    },
  };
};
