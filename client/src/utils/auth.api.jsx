import apiClient from "./apiClient";
import { AUTH } from "../constants/apiEndpoints";

export const loginUser = (data) =>
  apiClient.post(AUTH.LOGIN, data);

export const googleLogin = (token) =>
  apiClient.post(AUTH.GOOGLE, { token });
