import { request } from "./api";
import { TicketDto } from "../dto/ticket.dto";
import { TicKetBuy } from "../dto/ticketBuy.dto";

export async function getTicketsByShowtimeId(id: string): Promise<TicketDto[]> {
  const data = await request<TicketDto[]>("get", `/tickets/showtime/${id}`);
  return data !== null ? data : [];
}

export async function buyTickets(data: TicKetBuy[]) {
  let tickets;
  if (data.length === 1)
    tickets = await request<TicketDto[]>("post", `/tickets`, data[0]);
  else
    tickets = await request<TicketDto[]>("post", `/tickets/bulk`, data);
  return tickets;
}