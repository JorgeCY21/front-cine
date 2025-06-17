import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Movie = {
  id: number;
  title: string;
  duration: number;
  description: string;
  genre: string;
  rating: number;
  posterUrl: string;
  backdropUrl: string;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Simulación de API
  useEffect(() => {
    // Esto simula datos traídos desde backend
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: "Interstellar",
        duration: 169,
        description: "Un grupo de exploradores se embarca en el viaje más importante en la historia de la humanidad, viajando más allá de los límites de nuestra galaxia para descubrir si la humanidad tiene un futuro entre las estrellas.",
        genre: "Ciencia ficción",
        rating: 4.8,
        posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"
      },
      {
        id: 2,
        title: "Inception",
        duration: 148,
        description: "Dom Cobb es un ladrón con una rara habilidad para entrar en los sueños de la gente y robarles los secretos de sus subconscientes. Su habilidad lo ha convertido en un codiciado jugador en el mundo del espionaje corporativo.",
        genre: "Thriller psicológico",
        rating: 4.7,
        posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg"
      },
      {
        id: 3,
        title: "Toy Story",
        duration: 81,
        description: "Los juguetes de Andy, un niño de 6 años, temen que un nuevo regalo de cumpleaños los sustituya en el corazón de su dueño. Woody, un vaquero que ha sido su juguete favorito hasta ahora, trata de tranquilizarlos hasta que aparece Buzz Lightyear.",
        genre: "Animación",
        rating: 4.5,
        posterUrl: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/original/dji4Fm0gCDVb9DQQMRvAI8YNnTz.jpg"
      },
      {
        id: 4,
        title: "The Dark Knight",
        duration: 152,
        description: "Batman tiene que mantener el equilibrio entre el heroísmo y el vigilantismo para pelear contra un vil criminal conocido como el Joker, que sume a Ciudad Gótica en el caos.",
        genre: "Acción",
        rating: 4.9,
        posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/original/h3jYanWMEJq6JJsCopy1h7cT2Hs.jpg"
      },
      {
        id: 5,
        title: "Pulp Fiction",
        duration: 154,
        description: "Las vidas de dos mafiosos, un boxeador, la esposa de un gánster y un par de bandidos se entrelazan en cuatro historias de violencia y redención.",
        genre: "Crimen",
        rating: 4.6,
        posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg"
      },
      {
        id: 6,
        title: "The Shawshank Redemption",
        duration: 142,
        description: "Un banquero llamado Andy Dufresne es condenado a cadena perpetua por el asesinato de su esposa. A pesar de declararse inocente, es enviado a la prisión de Shawshank, donde forjará una gran amistad con Red.",
        genre: "Drama",
        rating: 4.9,
        posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/original/wPU78OPN4BYEgWYdXyg0phMee64.jpg"
      }
    ];
    setMovies(mockMovies);
    setFeaturedMovie(mockMovies[0]);
  }, []);

  const handleSelect = (movieId: number) => {
    navigate(`/showtimes/${movieId}`);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    setFeaturedMovie(movies[currentSlide === movies.length - 1 ? 0 : currentSlide + 1]);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    setFeaturedMovie(movies[currentSlide === 0 ? movies.length - 1 : currentSlide - 1]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Featured Movie */}
      {featuredMovie && (
        <div 
          className="relative h-96 w-full overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${featuredMovie.backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center">
            <button 
              onClick={prevSlide}
              className="absolute left-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition z-10"
            >
              <FiChevronLeft className="text-2xl" />
            </button>
            
            <div className="container mx-auto px-6 z-10 flex items-center">
              <div className="w-1/3 hidden md:block">
                <img 
                  src={featuredMovie.posterUrl} 
                  alt={featuredMovie.title}
                  className="rounded-lg shadow-2xl w-64 transform transition hover:scale-105"
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">{featuredMovie.title}</h1>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-yellow-400">
                    <FiStar className="mr-1" /> {featuredMovie.rating}
                  </span>
                  <span className="flex items-center">
                    <FiClock className="mr-1" /> {featuredMovie.duration} min
                  </span>
                  <span className="bg-indigo-600 px-2 py-1 rounded text-sm">
                    {featuredMovie.genre}
                  </span>
                </div>
                <p className="text-gray-300 max-w-2xl">{featuredMovie.description}</p>
                <button 
                  onClick={() => handleSelect(featuredMovie.id)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                >
                  Ver Horarios
                </button>
              </div>
            </div>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition z-10"
            >
              <FiChevronRight className="text-2xl" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
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

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition hover:-translate-y-2 hover:shadow-xl cursor-pointer"
              onClick={() => handleSelect(movie.id)}
            >
              <div className="relative">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex items-center text-yellow-400 text-sm">
                  <FiStar className="mr-1" /> {movie.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{movie.genre}</span>
                  <span className="flex items-center">
                    <FiClock className="mr-1" /> {movie.duration} min
                  </span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
                <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition">
                  Ver Horarios
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                CineMax
              </h3>
              <p className="text-gray-400">La mejor experiencia cinematográfica</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Términos</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Contacto</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
            © 2023 CineMax Premium Experience. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}