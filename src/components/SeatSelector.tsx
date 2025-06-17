import { useState, useEffect } from 'react';
import axios from 'axios';
import { Seat, Showtime } from '../types/cinemaTypes';

interface SeatSelectorProps {
  showtime: Showtime;
  onSeatSelect: (seatIds: number[]) => void;
}

const SeatSelector = ({ showtime, onSeatSelect }: SeatSelectorProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get<Seat[]>(`/api/showtimes/${showtime.id}/seats`);
        setSeats(response.data);
      } catch (err) {
        setError('Error al cargar los asientos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [showtime.id]);

  useEffect(() => {
    onSeatSelect(selectedSeats);
  }, [selectedSeats, onSeatSelect]);

  const toggleSeatSelection = (seatId: number) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId) 
        : [...prev, seatId]
    );
  };

  // Agrupar asientos por fila
  const seatsByRow = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  if (loading) return <div className="text-center py-4">Cargando asientos...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Selecciona tus asientos:</h3>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-center mb-6">
          <div className="inline-block bg-gray-800 text-white px-8 py-1 rounded">
            PANTALLA
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {Object.entries(seatsByRow).map(([row, rowSeats]) => (
            <div key={row} className="flex mb-2">
              <div className="w-6 flex items-center justify-center font-medium">{row}</div>
              <div className="flex space-x-2">
                {rowSeats.map(seat => (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeatSelection(seat.id)}
                    disabled={seat.is_taken}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs transition-colors ${
                      seat.is_taken 
                        ? 'bg-red-500 cursor-not-allowed' 
                        : selectedSeats.includes(seat.id) 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {seat.seat_number}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span>Ocupado</span>
        </div>
      </div>
      
      {selectedSeats.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h4 className="font-medium">Asientos seleccionados: {selectedSeats.length}</h4>
          <p>Total: ${selectedSeats.length * 10} (10$ por asiento)</p>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;