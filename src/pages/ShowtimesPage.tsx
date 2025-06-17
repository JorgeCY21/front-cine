import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Showtime = {
  id: number;
  movieId: number;
  roomName: string;
  startTime: string;
};

export default function ShowtimesPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulación de funciones
    const mockShowtimes: Showtime[] = [
      { id: 1, movieId: 1, roomName: "Sala 1", startTime: "2025-06-18T16:00:00" },
      { id: 2, movieId: 1, roomName: "Sala 2", startTime: "2025-06-18T19:30:00" },
      { id: 3, movieId: 2, roomName: "Sala 1", startTime: "2025-06-18T21:00:00" },
    ];

    // Filtrar funciones por película
    const filtered = mockShowtimes.filter(s => s.movieId === Number(movieId));
    setShowtimes(filtered);
  }, [movieId]);

  const handleSelect = (showtimeId: number) => {
    navigate(`/seats/${showtimeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Funciones disponibles</h1>
      {showtimes.length === 0 ? (
        <p className="text-center text-gray-600">No hay funciones para esta película.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showtimes.map((showtime) => (
            <div
              key={showtime.id}
              onClick={() => handleSelect(showtime.id)}
              className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer transition"
            >
              <h2 className="text-xl font-semibold mb-2">{showtime.roomName}</h2>
              <p className="text-gray-600">
                Hora: {new Date(showtime.startTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
