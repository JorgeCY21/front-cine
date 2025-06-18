// src/pages/MoviesPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MovieCarousel from "../components/MovieCarousel";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";

type Movie = {
  id: number;
  title: string;
  duration: number;
  description: string;
  genre: string;
  rating: number;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
};

// Mover fuera del componente para no recrearlo en cada render
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Interstellar",
    duration: 169,
    description:
      "Un grupo de exploradores se embarca en el viaje más importante en la historia de la humanidad.",
    genre: "Ciencia ficción",
    rating: 4.8,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    trailerUrl:
      "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&controls=0&loop=1&playlist=zSWdZVtXT7E",
  },
  {
    id: 2,
    title: "Inception",
    duration: 148,
    description:
      "Dom Cobb es un ladrón con una rara habilidad para entrar en los sueños de la gente.",
    genre: "Thriller psicológico",
    rating: 4.7,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailerUrl:
      "https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1&mute=1&controls=0&loop=1&playlist=YoHD9XEInc0",
  },
  {
    id: 3,
    title: "Toy Story",
    duration: 81,
    description:
      "Los juguetes de Andy, un niño de 6 años, temen que un nuevo regalo los sustituya.",
    genre: "Animación",
    rating: 4.5,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/original/dji4Fm0gCDVb9DQQMRvAI8YNnTz.jpg",
    trailerUrl:
      "https://www.youtube.com/embed/wmiIUN-7qhE?autoplay=1&mute=1&controls=0&loop=1&playlist=wmiIUN-7qhE",
  },
  {
    id: 4,
    title: "The Dark Knight",
    duration: 152,
    description:
      "Batman tiene que mantener el equilibrio entre el heroísmo y el vigilantismo.",
    genre: "Acción",
    rating: 4.9,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/original/h3jYanWMEJq6JJsCopy1h7cT2Hs.jpg",
    trailerUrl:
      "https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1&mute=1&controls=0&loop=1&playlist=EXeTwQWrcwY",
  },
  {
    id: 5,
    title: "Pulp Fiction",
    duration: 154,
    description:
      "Las vidas de dos mafiosos, un boxeador y un par de bandidos se entrelazan.",
    genre: "Crimen",
    rating: 4.6,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    trailerUrl:
      "https://www.youtube.com/embed/s7EdQ4FqbhY?autoplay=1&mute=1&controls=0&loop=1&playlist=s7EdQ4FqbhY",
  },
  {
    id: 6,
    title: "The Shawshank Redemption",
    duration: 142,
    description:
      "Un banquero es condenado a cadena perpetua por el asesinato de su esposa.",
    genre: "Drama",
    rating: 4.9,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/original/wPU78OPN4BYEgWYdXyg0phMee64.jpg",
    trailerUrl:
      "https://www.youtube.com/embed/6hB3S9bIaco?autoplay=1&mute=1&controls=0&loop=1&playlist=6hB3S9bIaco",
  },
];

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Carga inicial
  useEffect(() => {
    setMovies(mockMovies);
    setFeaturedMovie(mockMovies[0]);
  }, []);

  const handleSelect = (movieId: number) => {
    navigate(`/showtimes/${movieId}`);
  };

  const nextSlide = () => {
    if (!movies.length) return;
    const nextIndex = (currentSlide + 1) % movies.length;
    setCurrentSlide(nextIndex);
    setFeaturedMovie(movies[nextIndex]);
  };

  const prevSlide = () => {
    if (!movies.length) return;
    const prevIndex = (currentSlide - 1 + movies.length) % movies.length;
    setCurrentSlide(prevIndex);
    setFeaturedMovie(movies[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Featured Carousel */}
      {featuredMovie && (
        <MovieCarousel
          movie={featuredMovie}
          onPrev={prevSlide}
          onNext={nextSlide}
          onSelect={handleSelect}
        />
      )}

      {/* Movies Grid */}
      <main className="pt-24 px-6 bg-gray-950 min-h-screen text-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Películas en Cartelera</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
              Estrenos
            </button>
            <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
              Próximamente
            </button>
            <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
              Todas
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
