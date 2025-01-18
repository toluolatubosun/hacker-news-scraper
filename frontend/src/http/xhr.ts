import ms from "ms";
import axios, { type AxiosInstance } from "axios";
import { type JwtPayload, jwtDecode } from "jwt-decode";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

import { CONFIGS } from "@/configs";

const baseURL = CONFIGS.URL.API_BASE_URL;

// Create new axios instance
const $http: AxiosInstance = axios.create({
    baseURL,
    timeout: ms("30s"),
    headers: {
        "Content-Type": "application/json",
    },
});

$http.interceptors.request.use(async (config) => {
    await refreshAuthTokenLogic();

    const accessToken = getCookie(CONFIGS.AUTH.ACCESS_TOKEN_NAME);

    // check if request data is a FormData instance
    if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
    }

    // If access-token is available, add it to the Axios Authorization header
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export const refreshAuthTokenLogic = async () => {
    const accessTokenJWT = await getCookie(CONFIGS.AUTH.ACCESS_TOKEN_NAME);
    const refreshTokenJWT = await getCookie(CONFIGS.AUTH.REFRESH_TOKEN_NAME);

    // if access-token or refresh-token is not available, bail out
    if (!accessTokenJWT || !refreshTokenJWT) return;

    const accessToken: JwtPayload = jwtDecode(accessTokenJWT);
    const refreshToken: JwtPayload = jwtDecode(refreshTokenJWT);

    // confirm that both access-token and refresh-token have exp property
    if (!accessToken.exp || !refreshToken.exp) return;

    // Check if accessToken is expired and refreshToken has not expired
    const accessTokenIsExpired = accessToken.exp * 1000 < Date.now();
    const refreshTokenIsNotExpired = refreshToken.exp * 1000 > Date.now();

    if (accessTokenIsExpired && refreshTokenIsNotExpired) {
        try {
            const { data: response, status } = await axios.post(`${baseURL}/v1/auth/refresh-tokens`, { refresh_token: refreshTokenJWT }, { timeout: ms("2m") });

            if (status === 200 && response.data) {
                // update access-token and refresh-token
                setCookie(CONFIGS.AUTH.ACCESS_TOKEN_NAME, response.data.access_token);
                setCookie(CONFIGS.AUTH.REFRESH_TOKEN_NAME, response.data.refresh_token);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // if error is 401, logout user
                if (error.response?.status === 401) {
                    deleteCookie(CONFIGS.AUTH.ACCESS_TOKEN_NAME);
                    deleteCookie(CONFIGS.AUTH.REFRESH_TOKEN_NAME);
                    window.location.href = CONFIGS.AUTH.UNAUTHORIZED_REDIRECT;
                }
            }
        }
    }
};

export default $http;
