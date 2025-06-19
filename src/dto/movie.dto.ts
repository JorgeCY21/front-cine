export class MovieDto {
  id!: number;
  title!: string;
  duration!: number;
  description?: string;
  genre?: string;
  rating?: number;
  url_poster?: string;
  url_background?: string;
  url_trailer?: string;
}