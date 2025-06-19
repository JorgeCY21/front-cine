import { UserDto } from "./user.dto";
import { ShowtimeDto } from "./showtime.dto";
import { SeatDto } from "./seat.dto";

export class TicketDto {
  id!: number;
  user!: UserDto;
  showtime!: ShowtimeDto;
  seat!: SeatDto;
  purchase_date?: Date;
}