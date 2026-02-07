import Axios from "axios";

export const getMainApiUrl = (path: string) =>
  import.meta.env.VITE_API_BASE_URL + path;

export const mainApiClient = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_APP_API_KEY,
  },
});
