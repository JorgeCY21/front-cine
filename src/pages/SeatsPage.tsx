import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Seat = {
  id: number;
  seatNumber: number;
  row: string;
  available: boolean;
};

export default function SeatsPage() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulación de asientos (en una sala típica)
    const mockSeats: Seat[] = [];

    for (let row = 0; row < 5; row++) {
      for (let num = 1; num <= 10; num++) {
        mockSeats.push({
          id: row * 10 + num,
          seatNumber: num,
          row: String.fromCharCode(65 + row), // A, B, C...
          available: Math.random() > 0.2, // Algunos ocupados aleatoriamente
        });
      }
    }

    setSeats(mockSeats);
  }, [showtimeId]);

  const toggleSeat = (id: number) => {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const user = localStorage.getItem("user");
    if (!user) return navigate("/");

    // Guardar en localStorage para la siguiente vista
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    localStorage.setItem("showtimeId", showtimeId!);

    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Selecciona tus asientos</h1>

      <div className="grid grid-cols-10 gap-2 justify-center mb-6">
        {seats.map((seat) => (
          <div
            key={seat.id}
            onClick={() => seat.available && toggleSeat(seat.id)}
            className={`text-center py-2 rounded cursor-pointer border ${
              !seat.available
                ? "bg-gray-300 text-white cursor-not-allowed"
                : selectedSeats.includes(seat.id)
                ? "bg-green-500 text-white"
                : "bg-white hover:bg-blue-100"
            }`}
          >
            {seat.row}
            {seat.seatNumber}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
        >
          Confirmar selección
        </button>
      </div>
    </div>
  );
}
