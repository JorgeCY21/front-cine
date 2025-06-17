export interface Movie {
  id: number;
  title: string;
  duration: number;
  description: string;
  posterUrl?: string;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
}

export interface Showtime {
  id: number;
  movie_id: number;
  room_id: number;
  start_time: string;
  room: Room;
}

export interface Seat {
  id: number;
  room_id: number;
  seat_number: number;
  row: string;
  is_taken: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
}