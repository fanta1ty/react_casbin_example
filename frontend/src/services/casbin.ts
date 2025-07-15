import axios from "axios";
import {
  CasbinPermission,
  EnforceRequest,
  EnforceResponse,
} from "../types/casbin";

const API_BASE_URL = "http://localhost:5001/api/casbin";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const casbinApi = {
  getUserPermissions: async (username: string): Promise<CasbinPermission> => {
    const response = await api.get(`/permissions/${username}`);
    return response.data;
  },

  enforcePermission: async (
    request: EnforceRequest
  ): Promise<EnforceResponse> => {
    const response = await api.post("/enforce", request);
    return response.data;
  },

  getAllPolicies: async () => {
    const response = await api.get("/policies");
    return response.data;
  },

  addPolicy: async (subject: string, object: string, action: string) => {
    const response = await api.post("/add-policy", {
      subject,
      object,
      action,
    });
    return response.data;
  },

  removePolicy: async (subject: string, object: string, action: string) => {
    const response = await api.delete("/remove-policy", {
      data: { subject, object, action },
    });
    return response.data;
  },
};
