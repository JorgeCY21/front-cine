import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShowtimeSelector from '../components/ShowtimeSelector';
import SeatSelector from '../components/SeatSelector';
import Checkout from '../components/Checkout';
import { Movie, Showtime } from '../types/cinemaTypes';

const Booking = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [step, setStep] = useState<number>(1);
  
  // En una aplicación real, obtendrías la película de la API
  const [movie, setMovie] = useState<Movie>({
    id: parseInt(movieId || '0'),
    title: 'Película de Ejemplo',
    duration: 120,
    description: 'Esta es una descripción de ejemplo para la película.'
  });

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setStep(2);
  };

  const handleSeatSelect = (seats: number[]) => {
    setSelectedSeats(seats);
    if (seats.length > 0) {
      setStep(3);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{movie.title}</h1>
      
      {step === 1 && (
        <ShowtimeSelector movieId={movie.id} onSelect={handleShowtimeSelect} />
      )}
      
      {step === 2 && selectedShowtime && (
        <SeatSelector showtime={selectedShowtime} onSeatSelect={handleSeatSelect} />
      )}
      
      {step === 3 && selectedShowtime && (
        <Checkout 
          selectedSeats={selectedSeats} 
          showtime={selectedShowtime} 
          movie={movie} 
        />
      )}
      
      {step > 1 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition-colors"
        >
          Volver
        </button>
      )}
    </div>
  );
};

export default Booking;