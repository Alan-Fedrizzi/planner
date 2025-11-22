import axios from "axios";

// https://nlw-journey.apidocumentation.com/reference

export const api = axios.create({
  // TODO
  // não comitar o IP
  baseURL: "http://***:3333",
});
