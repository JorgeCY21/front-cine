import { request } from "./api";
import { ShowtimeDto } from "../dto/showtime.dto";

export async function getShowtimeById(id: string): Promise<ShowtimeDto> {
  const data = await request<ShowtimeDto>("get", `/showtimes/${id}`);
  if (data === null) {
    throw new Error("Showtime not found");
  }
  return data;
}

export async function getShowtimeByMovieId(id: string): Promise<ShowtimeDto[]> {
  const data = await request<ShowtimeDto[]>("get", `/showtimes/movies/${id}/showtimes`);
  return data !== null ? data : [];
}
