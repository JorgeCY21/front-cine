import { useState, useEffect } from 'react';
import axios from 'axios';
import { Showtime } from '../types/cinemaTypes';

interface ShowtimeSelectorProps {
  movieId: number;
  onSelect: (showtime: Showtime) => void;
}

const ShowtimeSelector = ({ movieId, onSelect }: ShowtimeSelectorProps) => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await axios.get<Showtime[]>(`/api/movies/${movieId}/showtimes`);
        setShowtimes(response.data);
      } catch (err) {
        setError('Error al cargar los horarios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    onSelect(showtime);
  };

  if (loading) return <div className="text-center py-4">Cargando horarios...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Selecciona un horario:</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {showtimes.map((showtime) => (
          <button
            key={showtime.id}
            onClick={() => handleShowtimeSelect(showtime)}
            className={`p-3 rounded border transition-colors ${
              selectedShowtime?.id === showtime.id
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
          >
            {new Date(showtime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </button>
        ))}
      </div>
      
      {selectedShowtime && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-medium">Sala: {selectedShowtime.room.name}</h4>
          <p>Capacidad: {selectedShowtime.room.capacity} asientos</p>
        </div>
      )}
    </div>
  );
};

export default ShowtimeSelector;