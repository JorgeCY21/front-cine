import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type SeatInfo = {
  id: number;
  seatNumber: number;
  row: string;
};

type ShowtimeInfo = {
  id: number;
  movieTitle: string;
  roomName: string;
  startTime: string;
};

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [showtime, setShowtime] = useState<ShowtimeInfo | null>(null);

  useEffect(() => {
    const storedSeats = JSON.parse(localStorage.getItem("selectedSeats") || "[]") as number[];
    const storedShowtimeId = localStorage.getItem("showtimeId");

    // Validar datos
    if (!storedShowtimeId || storedSeats.length === 0) {
      navigate("/movies");
      return;
    }

    // Simular recuperación de datos del showtime
    const mockShowtimes: ShowtimeInfo[] = [
      {
        id: 1,
        movieTitle: "Interstellar",
        roomName: "Sala 1",
        startTime: "2025-06-18T16:00:00",
      },
      {
        id: 2,
        movieTitle: "Interstellar",
        roomName: "Sala 2",
        startTime: "2025-06-18T19:30:00",
      },
      {
        id: 3,
        movieTitle: "Inception",
        roomName: "Sala 1",
        startTime: "2025-06-18T21:00:00",
      },
    ];

    const foundShowtime = mockShowtimes.find(
      (s) => s.id === Number(storedShowtimeId)
    );
    if (!foundShowtime) {
      navigate("/movies");
      return;
    }
    setShowtime(foundShowtime);

    // Simular recuperación de info de asientos
    const allSeats: SeatInfo[] = [];
    for (let row = 0; row < 5; row++) {
      for (let num = 1; num <= 10; num++) {
        const id = row * 10 + num;
        allSeats.push({ id, seatNumber: num, row: String.fromCharCode(65 + row) });
      }
    }

    const selectedSeatObjects = allSeats.filter((seat) =>
      storedSeats.includes(seat.id)
    );
    setSeats(selectedSeatObjects);
  }, [navigate]);

  const handleFinish = () => {
    // Simula "guardar" y volver al inicio
    alert("¡Compra simulada exitosa!");
    localStorage.removeItem("selectedSeats");
    localStorage.removeItem("showtimeId");
    navigate("/movies");
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Confirmación de compra</h1>
      {showtime && (
        <div className="bg-gray-100 p-4 rounded shadow max-w-md mx-auto mb-4">
          <p><strong>Película:</strong> {showtime.movieTitle}</p>
          <p><strong>Sala:</strong> {showtime.roomName}</p>
          <p>
            <strong>Horario:</strong>{" "}
            {new Date(showtime.startTime).toLocaleString()}
          </p>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded shadow max-w-md mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-2">Asientos seleccionados:</h2>
        <div className="flex flex-wrap gap-2">
          {seats.map((seat) => (
            <span
              key={seat.id}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              {seat.row}
              {seat.seatNumber}
            </span>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleFinish}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
