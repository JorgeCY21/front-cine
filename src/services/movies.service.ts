import { request } from "./api";
import { MovieDto } from "../dto/movie.dto";

export async function getMovies(): Promise<MovieDto[]> {
  const data = await request<MovieDto[]>("get", "/movies");
  return data !== null ? data : [];
}

export async function getMovieById(id: string): Promise<MovieDto | null> {
  const data = await request<MovieDto>("get", `/movies/${id}`);
  return data !== null ? data : null;
}