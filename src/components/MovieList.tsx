import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Movie } from '../types/cinemaTypes';

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<Movie[]>('/api/movies');
        setMovies(response.data);
      } catch (err) {
        setError('Error al cargar las películas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando películas...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {movies.map((movie) => (
        <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="bg-gray-200 h-48 flex items-center justify-center">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">Poster de {movie.title}</span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2">{movie.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{movie.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{movie.duration} min</span>
              <Link 
                to={`/booking/${movie.id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
              >
                Comprar entradas
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;