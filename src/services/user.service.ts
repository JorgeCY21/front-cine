import { request } from "./api";

export async function login(data: { email: string, password: string }) {
  return request("post", "/users/login", data);
}
