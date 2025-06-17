import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiMapPin, FiFilm, FiArrowLeft } from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";
import { motion } from "framer-motion";

type SeatInfo = {
  id: number;
  seatNumber: number;
  row: string;
  type: "standard" | "premium" | "vip";
};

type ShowtimeInfo = {
  id: number;
  movieTitle: string;
  roomName: string;
  startTime: string;
  format: string;
  posterUrl: string;
};

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [showtime, setShowtime] = useState<ShowtimeInfo | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

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
        roomName: "Sala IMAX",
        startTime: "2025-06-18T19:30:00",
        format: "IMAX 3D",
        posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
      },
      {
        id: 2,
        movieTitle: "Inception",
        roomName: "Sala Premium",
        startTime: "2025-06-18T21:00:00",
        format: "4K Dolby Atmos",
        posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
      },
      {
        id: 3,
        movieTitle: "The Dark Knight",
        roomName: "Sala VIP",
        startTime: "2025-06-19T20:00:00",
        format: "4K Luxury",
        posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
      }
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
    const rows = ["A", "B", "C", "D", "E"];
    const seatTypes: ("standard" | "premium" | "vip")[] = ["standard", "standard", "premium", "premium", "vip"];

    for (let row = 0; row < rows.length; row++) {
      for (let num = 1; num <= 10; num++) {
        const id = row * 10 + num;
        allSeats.push({ 
          id, 
          seatNumber: num, 
          row: rows[row],
          type: seatTypes[row]
        });
      }
    }

    const selectedSeatObjects = allSeats.filter((seat) =>
      storedSeats.includes(seat.id)
    );
    setSeats(selectedSeatObjects);
  }, [navigate]);

  const calculateTotal = () => {
    return seats.reduce((total, seat) => {
      switch(seat.type) {
        case "vip": return total + 16.99;
        case "premium": return total + 12.99;
        default: return total + 9.99;
      }
    }, 0);
  };

  const handleFinish = () => {
    setIsCompleting(true);
    // Simular proceso de pago
    setTimeout(() => {
      alert("¡Compra exitosa! Tu reservación está confirmada.");
      localStorage.removeItem("selectedSeats");
      localStorage.removeItem("showtimeId");
      navigate("/movies");
    }, 2000);
  };

  const getSeatBadgeColor = (type: string) => {
    switch(type) {
      case "vip": return "bg-gradient-to-br from-yellow-500 to-yellow-600";
      case "premium": return "bg-gradient-to-br from-indigo-500 to-purple-600";
      default: return "bg-gradient-to-br from-green-500 to-green-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md py-4 px-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition"
          >
            <FiArrowLeft className="mr-2" /> Volver
          </button>
          <h1 className="text-xl font-bold">Confirmación de Compra</h1>
          <div className="w-8"></div> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <FiCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">¡Reserva casi lista!</h2>
          <p className="text-gray-300 max-w-md mx-auto">
            Revisa los detalles de tu compra y confirma para finalizar tu experiencia CineMax
          </p>
        </motion.div>

        {/* Movie Card */}
        {showtime && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl mb-8 border border-gray-700"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img 
                  src={showtime.posterUrl} 
                  alt={showtime.movieTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h3 className="text-2xl font-bold mb-2">{showtime.movieTitle}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <FiClock className="text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Fecha y Hora</p>
                      <p className="font-medium">
                        {new Date(showtime.startTime).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiMapPin className="text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Sala</p>
                      <p className="font-medium">{showtime.roomName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiFilm className="text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Formato</p>
                      <p className="font-medium">{showtime.format}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaTicketAlt  className="text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-sm">Asientos</p>
                      <p className="font-medium">{seats.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Seats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <FaTicketAlt  className="text-indigo-400 mr-2" />
            Tus Asientos Seleccionados
          </h3>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {seats.map((seat) => (
              <motion.div
                key={seat.id}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full text-white font-medium flex items-center ${getSeatBadgeColor(seat.type)}`}
              >
                {seat.row}-{seat.seatNumber}
                <span className="ml-2 text-xs opacity-80">
                  {seat.type === "vip" ? "VIP" : seat.type === "premium" ? "Premium" : "Standard"}
                </span>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <p className="text-gray-300">Total a pagar:</p>
            <p className="text-3xl font-bold text-yellow-400">${calculateTotal().toFixed(2)}</p>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            onClick={handleFinish}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isCompleting}
            className={`relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg w-full max-w-md mx-auto ${
              isCompleting 
                ? "bg-indigo-700 cursor-not-allowed" 
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            {isCompleting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Procesando pago...
              </div>
            ) : (
              "Confirmar y Pagar Ahora"
            )}
          </motion.button>
          
          <p className="text-gray-400 mt-4 text-sm">
            Al confirmar, aceptas nuestros Términos y Condiciones
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 py-6 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-gray-400 hover:text-white transition">Términos</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Ayuda</a>
          </div>
          <p className="text-gray-500 text-sm">© 2023 CineMax Premium Experience. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}