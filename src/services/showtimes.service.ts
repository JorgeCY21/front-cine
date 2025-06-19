import { request } from "./api";
import { ShowtimeDto } from "../dto/showtime.dto";

export async function getShowtimeByMovieId(id: string): Promise<ShowtimeDto[]> {
  const data = await request<ShowtimeDto[]>("get", `/showtimes/movies/${id}/showtimes`);
  return data !== null ? data : [];
}
