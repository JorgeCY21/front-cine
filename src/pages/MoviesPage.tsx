import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Movie = {
  id: number;
  title: string;
  duration: number;
  description: string;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  // Simulación de API
  useEffect(() => {
    // Esto simula datos traídos desde backend
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: "Interstellar",
        duration: 169,
        description: "Exploración espacial y agujeros de gusano.",
      },
      {
        id: 2,
        title: "Inception",
        duration: 148,
        description: "Una historia sobre sueños dentro de sueños.",
      },
      {
        id: 3,
        title: "Toy Story",
        duration: 81,
        description: "Juguetes con vida propia.",
      },
    ];
    setMovies(mockMovies);
  }, []);

  const handleSelect = (movieId: number) => {
    navigate(`/showtimes/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Películas Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded shadow p-4 hover:shadow-lg transition cursor-pointer" onClick={() => handleSelect(movie.id)}>
            <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{movie.description}</p>
            <p className="text-gray-800 font-medium">Duración: {movie.duration} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}
