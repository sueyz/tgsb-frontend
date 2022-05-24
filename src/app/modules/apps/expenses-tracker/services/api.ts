import axios from "axios";

export const api = axios.create({
  // URL that repeats in all requests
  baseURL: 'http://localhost:3000/api',
})