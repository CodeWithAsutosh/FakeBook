import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:3002",
  withCredentials: true,
  headers: {
    Authorization: JSON.parse(localStorage.getItem("token"))
      ? `Bearer ${JSON.parse(localStorage.getItem("token"))}`
      : "",
  },
});
