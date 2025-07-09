import { request } from "./api";

export async function login(data: { email: string, password: string }) {
  return request("post", "/users/login", data);
}

export async function register(data: { first_name: string, last_name: string, email: string, password: string }) {
  return request("post", "/users", data)
}

export async function createResetPassword(data: { email: string }) {
  return request("post", "/users/create-reset-password", data);
}

export async function verifyResetCode(data: { email: string, code: number }) {
  const { email, code } = data;
  if (!email || !code) {
    throw new Error("Email and code are required");
  }

  return request("post", "/users/verify-reset-code", {
    email,
    code,
  });
}

export async function resetPassword(data: { email: string, newPassword: string }) {
  const { email, newPassword } = data;
  if (!email || !newPassword) {
    throw new Error("Email and new password are required");
  }

  return request("post", "/users/reset-password", {
    email,
    newPassword,
  });
}