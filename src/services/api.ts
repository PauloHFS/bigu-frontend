import axios from "axios";
import { getCookie } from "cookies-next";
import { parseCookies } from "nookies";

const baseURL = 'https://bigu-backend.herokuapp.com';

export const api = axios.create({
  baseURL,
  headers: { 'Accept': 'application/json' },
});

// let token;
// if (typeof window !== 'undefined') {
//   // Perform localStorage action
//   // token = localStorage.getItem("bigu-token")

//   token = token ? getCookie("token") : null;
// }


api.interceptors.request.use( config => {
  const { 'nextauth.token': token } = parseCookies();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config
})

