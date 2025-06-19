import { request } from "./api";

export async function login(data: { email: string, password: string }) {
  return request("post", "/users/login", data);
}

export async function register(data: { first_name: string, last_name: string, email: string, password: string }) {
  return request("post", "/users", data)
}
