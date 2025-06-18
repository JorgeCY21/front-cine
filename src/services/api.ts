import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BACK_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

type HTTPMethod = 'get' | 'post' | 'put' | 'delete';

/**
 * Función genérica para manejar peticiones HTTP.
 * @param method - Método HTTP de la petición.
 * @param endpoint - Endpoint de la API.
 * @param data - Datos a enviar en la petición.
 * @param isList - Indica si la respuesta es una lista y debe ordenarse.
 * @param isFormData - Indica si los datos se están enviando como FormData.
 * @returns Respuesta de la API o lanza un error.
 */
export async function request<T = unknown>(
  method: HTTPMethod,
  endpoint: string,
  data: Record<string, T> = {}
): Promise<T | null> {
  try {
    const config: AxiosRequestConfig = {};

    let response: AxiosResponse<T>;

    if (method === 'get' || method === 'delete') {
      response = await api[method](endpoint, config);
    } else {
      response = await api[method](endpoint, data, config);
    }

    const result = response.data;

    return result;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error("Error en la petición", {
      method,
      endpoint,
      data,
      status: err.response?.status,
      message: err.response?.data || err.message,
    });
    throw err;
  }
}

export default api;
