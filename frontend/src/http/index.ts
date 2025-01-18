import type { AxiosError, AxiosResponse } from "axios";

import $http from "./xhr";

// Define the API response structure
export interface APIAxiosResponse<T = any> extends AxiosResponse<APIResponse<T>> {}
export interface APIAxiosError<T = null> extends AxiosError<APIResponse<T>> {}

// Auth
export const APIVersion1Register = async (data: APIVersion1RegisterPayload) => $http.post<APIAxiosError, APIAxiosResponse<APIVersion1RegisterResponse>>("/v1/auth/register", data).then((res) => res.data);
export const APIVersion1Login = async (data: APIVersion1LoginPayload) => $http.post<APIAxiosError, APIAxiosResponse<APIVersion1LoginResponse>>("/v1/auth/login", data).then((res) => res.data);

// User
export const APIVersion1GetCurrentUser = async () => $http.get<APIAxiosError, APIAxiosResponse<User>>("/v1/users/me").then((res) => res.data);
