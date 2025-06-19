import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MovieCarousel from "../components/MovieCarousel";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import { getMovies } from "../services/movies.service";
import { MovieDto } from "../dto/movie.dto";

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<MovieDto | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Carga inicial
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data: MovieDto[] = await getMovies();
        if (!data) {
          setMovies([])
          return
        }
        setMovies(data);
        setFeaturedMovie(data[0]); // Primera película destacada
      } catch (error) {
        console.error("Error al obtener películas:", error);
      }
    };

    fetchMovies();
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
      <main className="flex-grow pt-8 md:pt-16 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          {/* Title and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Películas en Cartelera</h2>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-800 rounded-lg hover:bg-gray-700 transition whitespace-nowrap">
                Estrenos
              </button>
              <button className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-800 rounded-lg hover:bg-gray-700 transition whitespace-nowrap">
                Próximamente
              </button>
              <button className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-indigo-600 rounded-lg hover:bg-indigo-700 transition whitespace-nowrap">
                Todas
              </button>
            </div>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}