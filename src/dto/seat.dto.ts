export class SeatDto {
  id!: number;
  seat_number!: number;
  row!: string;
  available!: boolean;
  type!: "standard" | "premium" | "vip";
  price!: number;
};