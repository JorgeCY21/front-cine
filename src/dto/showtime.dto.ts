import { MovieDto } from "./movie.dto";
import { RoomDto } from "./room.dto";

export class ShowtimeDto {
  id!: number;
  movie!: MovieDto;
  room!: RoomDto;
  start_time!: Date;
  format!: string;
  price!: number;

}