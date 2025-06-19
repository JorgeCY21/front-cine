import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheck, FiX, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { getShowtimeById } from "../services/showtimes.service";
import { ShowtimeDto } from "../dto/showtime.dto";
import { getTicketsByShowtimeId } from "../services/tickets.service";
import { SeatDto } from "../dto/seat.dto";
import { TicketDto } from "../dto/ticket.dto";

export default function SeatsPage() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showtimeInfo, setShowtimeInfo] = useState<ShowtimeDto>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showtime = await getShowtimeById(showtimeId ?? '1');
        const tickets = await getTicketsByShowtimeId(showtimeId ?? '1');

        const seats = generateSeats(showtime, tickets);
        setSeats(seats);
        setShowtimeInfo(showtime);
      } catch (error) {
        console.error('Error fetching seat or showtime data:', error);
      }
    };

    fetchData();
  }, [showtimeId]);

  function generateSeats(showtime: ShowtimeDto, tickets: TicketDto[]): SeatDto[] {
    const capacity = showtime.room.capacity;
    const seatsPerRow = 10;
    const numRows = capacity / seatsPerRow;

    const rows: string[] = Array.from({ length: numRows }, (_, i) =>
      String.fromCharCode(65 + i)
    );

    const seatTypes: ("standard" | "premium" | "vip")[] = ["standard", "premium", "vip"];
    const prices = { standard: 9.99, premium: 12.99, vip: 16.99 };

    // Repartir tipos de asiento por fila
    const typePerRow: ("standard" | "premium" | "vip")[] = [];
    const base = Math.floor(numRows / seatTypes.length);
    const remainder = numRows % seatTypes.length;

    for (let i = 0; i < seatTypes.length; i++) {
      const count = base + (i < remainder ? 1 : 0);
      for (let j = 0; j < count; j++) {
        typePerRow.push(seatTypes[i]);
      }
    }

    const takenSeats = new Set(
      tickets.map(t => `${t.seat.row}-${t.seat.seat_number}`)
    );

    const seats: SeatDto[] = [];

    rows.forEach((rowLetter, rowIndex) => {
      for (let num = 1; num <= seatsPerRow; num++) {
        const key = `${rowLetter}-${num}`;
        seats.push({
          id: rowIndex * seatsPerRow + num,
          seat_number: num,
          row: rowLetter,
          available: !takenSeats.has(key),
          type: typePerRow[rowIndex],
          price: prices[typePerRow[rowIndex]],
        });
      }
    });

    return seats;
  }

  const toggleSeat = (id: number) => {
    setSelectedSeats((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];

      return updated.sort((a, b) => a - b);
    });
  };

  const handleConfirm = () => {
    const user = localStorage.getItem("user");
    if (!user) return navigate("/");

    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    localStorage.setItem("showtimeId", showtimeId!);
    navigate("/confirmation");
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const getSeatColor = (seat: SeatDto) => {
    if (!seat.available) return "bg-gray-700";
    if (selectedSeats.includes(seat.id)) {
      switch (seat.type) {
        case "vip": return "bg-gradient-to-br from-yellow-500 to-yellow-700";
        case "premium": return "bg-gradient-to-br from-indigo-600 to-purple-600";
        default: return "bg-gradient-to-br from-green-500 to-green-600";
      }
    }
    switch (seat.type) {
      case "vip": return "bg-gray-800 border-yellow-500";
      case "premium": return "bg-gray-800 border-indigo-500";
      default: return "bg-gray-800 border-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Theater Header - Optimizado para móviles */}
      <header className="bg-black/80 backdrop-blur-md py-3 px-4 sm:py-4 sm:px-6 shadow-xl sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition text-sm sm:text-base cursor-pointer"
          >
            <FiArrowLeft className="mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Volver</span>
          </button>

          <div className="text-center max-w-[60%]">
            <h1 className="text-sm xs:text-base sm:text-xl font-bold truncate">
              {showtimeInfo?.movie.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              {showtimeInfo?.start_time ? new Date(showtimeInfo.start_time).toLocaleDateString() : ""} • {showtimeInfo?.room.name}
            </p>
          </div>

          <div className="w-6 sm:w-8"></div> {/* Spacer para alineación */}
        </div>
      </header>

      {/* Screen Visualization - Adaptado para móviles */}
      <div className="py-3 px-3 sm:py-4 sm:px-4 flex-grow flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
          {/* Screen */}
          <div className="bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-2xl sm:rounded-t-3xl h-8 sm:h-12 mb-3 sm:mb-4 shadow-lg flex items-center justify-center relative">
            <div className="w-full h-1 sm:h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
            <span className="absolute text-xs sm:text-lg font-bold tracking-widest">PANTALLA</span>
          </div>

          {/* Seats Grid - Responsive con diferentes tamaños */}
          <div className="grid grid-cols-10 gap-1 sm:gap-2 justify-center mb-4 flex-grow overflow-auto px-1">
            {seats.map((seat) => (
              <motion.div
                key={seat.id}
                whileHover={seat.available ? { scale: 1.05 } : {}}
                whileTap={seat.available ? { scale: 0.95 } : {}}
                onClick={() => seat.available && toggleSeat(seat.id)}
                className={`flex flex-col items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-sm sm:rounded-md border cursor-pointer transition-all text-[10px] sm:text-xs ${getSeatColor(seat)} ${!seat.available ? "cursor-not-allowed" : "hover:brightness-125"
                  }`}
              >
                {seat.available ? (
                  selectedSeats.includes(seat.id) ? (
                    <FiCheck className="text-white text-xs sm:text-sm" />
                  ) : (
                    <span className="text-white font-medium hidden sm:inline">{seat.row}-{seat.seat_number}</span>
                  )
                ) : (
                  <FiX className="text-gray-500 text-xs sm:text-sm" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Seat Info & Action Panel - Responsive */}
      <div className="bg-gray-800 border-t border-gray-700 py-3 px-4 sm:py-4 sm:px-6 shadow-2xl">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            {/* Selected Seats Info */}
            <div className="w-full md:w-auto">
              {selectedSeats.length > 0 ? (
                <div>
                  <h3 className="text-xs sm:text-sm text-gray-400 mb-1">Asientos seleccionados:</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {selectedSeats.map(seatId => {
                      const seat = seats.find(s => s.id === seatId);
                      return (
                        <span
                          key={seatId}
                          className="px-2 py-1 rounded-full text-[10px] xs:text-xs font-medium flex items-center"
                          style={{
                            background: seat?.type === "vip"
                              ? "linear-gradient(135deg, #f59e0b, #b45309)"
                              : seat?.type === "premium"
                                ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                                : "linear-gradient(135deg, #10b981, #059669)"
                          }}
                        >
                          {seat?.row}-{seat?.seat_number}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-400">Selecciona tus asientos</p>
              )}
            </div>

            {/* Price Summary */}
            <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-normal">
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-300">Total</p>
                <p className="text-base sm:text-xl font-bold text-yellow-400">
                  S/.{calculateTotal().toFixed(2)}
                </p>
              </div>

              {/* Confirm Button */}
              <motion.button
                onClick={handleConfirm}
                disabled={selectedSeats.length === 0}
                whileHover={selectedSeats.length > 0 ? { scale: 1.03 } : {}}
                whileTap={selectedSeats.length > 0 ? { scale: 0.97 } : {}}
                className={`flex items-center px-3 sm:px-5 py-1 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-base flex-shrink-0 ${selectedSeats.length > 0
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg cursor-pointer"
                  : "bg-gray-700 cursor-not-allowed"
                  }`}
              >
                <FiShoppingCart className="mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Confirmar</span> ({selectedSeats.length})
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend - Responsive */}
      <div className="bg-gray-900 py-2 sm:py-3 px-4 sm:px-6 border-t border-gray-700">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-green-500 to-green-600 mr-1"></div>
              <span>Standard (S/.9.99)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-indigo-600 to-purple-600 mr-1"></div>
              <span>Premium (S/.12.99)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-yellow-500 to-yellow-700 mr-1"></div>
              <span>VIP (S/.16.99)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-800 border border-gray-500 mr-1"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-700 mr-1 flex items-center justify-center">
                <FiX className="text-[8px] sm:text-xs text-gray-500" />
              </div>
              <span>Ocupado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}