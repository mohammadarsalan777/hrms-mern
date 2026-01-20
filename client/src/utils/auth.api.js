import apiClient from "@/services/apiClient";
import { AUTH } from "@/services/apiEndpionts";

export const loginUser = (data) =>
  apiClient.post(AUTH.LOGIN, data);

export const googleLogin = (token) =>
  apiClient.post(AUTH.GOOGLE, { token });

export const registerEmployee = (data) =>
  apiClient.post(AUTH.REGISTER, data);