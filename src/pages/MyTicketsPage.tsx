import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiMapPin, FiCalendar, FiArrowLeft } from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../components/Header";

type Ticket = {
  id: string;
  movieTitle: string;
  posterUrl: string;
  showtime: string;
  room: string;
  seats: string[];
  price: number;
  format: string;
  purchaseDate: string;
};

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de datos (en un caso real, harías una petición a tu API)
    const mockTickets: Ticket[] = [
      {
        id: "1",
        movieTitle: "Dune: Parte Dos",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg",
        showtime: "2024-05-15T18:30:00",
        room: "Sala IMAX 3",
        seats: ["A5", "A6"],
        price: 45.90,
        format: "IMAX",
        purchaseDate: "2024-05-10T12:45:00",
      },
      {
        id: "2",
        movieTitle: "Deadpool & Wolverine",
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMDExZGMyOTMtMDgyYi00NGIwLWJhMTEtNWQ4MmIxMDA4YTMyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg",
        showtime: "2024-05-20T21:00:00",
        room: "Sala 4DX 2",
        seats: ["B3", "B4"],
        price: 39.90,
        format: "4DX",
        purchaseDate: "2024-05-12T15:20:00",
      },
    ];

    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Encabezado */}
        <div className="flex items-center mb-8">
          <Link 
            to="/movies" 
            className="mr-4 p-2 rounded-full hover:bg-gray-800 transition"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
            <FaTicketAlt className="inline mr-3" />
            Mis Entradas
          </h1>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <div className="h-8 w-8 mx-auto mb-4 rounded-full bg-indigo-600/50"></div>
              <p className="text-gray-400">Cargando tus entradas...</p>
            </div>
          </div>
        )}

        {/* Lista de tickets */}
        {!loading && tickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FaTicketAlt className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No tienes entradas aún
            </h3>
            <Link
              to="/movies"
              className="inline-block px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:opacity-90 transition"
            >
              Ver películas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/70 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all shadow-lg"
              >
                {/* Encabezado del ticket */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-400">Código #{ticket.id}</span>
                    <h3 className="text-xl font-bold truncate max-w-[200px] sm:max-w-none">
                      {ticket.movieTitle}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ticket.format === "IMAX" 
                      ? "bg-purple-600/30 text-purple-300" 
                      : "bg-cyan-600/30 text-cyan-300"
                  }`}>
                    {ticket.format}
                  </span>
                </div>

                {/* Contenido del ticket */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                  {/* Poster */}
                  <div className="w-full sm:w-1/3 flex-shrink-0">
                    <img
                      src={ticket.posterUrl}
                      alt={ticket.movieTitle}
                      className="rounded-lg w-full h-auto object-cover shadow-md"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="w-full">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-indigo-400 mb-2">
                        Detalles de la función
                      </h4>
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-300">
                          <FiCalendar className="mr-2 text-indigo-500" />
                          {formatDate(ticket.showtime)}
                        </p>
                        <p className="flex items-center text-gray-300">
                          <FiMapPin className="mr-2 text-indigo-500" />
                          {ticket.room}
                        </p>
                        <p className="flex items-center text-gray-300">
                          <FaTicketAlt className="mr-2 text-indigo-500" />
                          Asientos: {ticket.seats.join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-400">Precio total</span>
                        <p className="text-2xl font-bold text-yellow-400">
                          S/.{ticket.price.toFixed(2)}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">
                        Ver QR
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer del ticket */}
                <div className="px-4 py-3 bg-gray-900/50 text-xs text-gray-400 border-t border-gray-800">
                  Comprado el {formatDate(ticket.purchaseDate)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}