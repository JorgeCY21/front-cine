import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiArrowLeft } from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { TicketDto } from "../dto/ticket.dto";
import { misTickets } from "../services/tickets.service";

export default function MyTicketsPage() {
  const [loading, setLoading] = useState(true);
  const [ticketsGrouped, setTicketsGrouped] = useState<Record<number, TicketDto[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const mockTickets: TicketDto[] = await misTickets(user.id);

      const grouped = mockTickets.reduce((acc: Record<number, TicketDto[]>, ticket) => {
        const sid = ticket.showtime.id;
        if (!acc[sid]) acc[sid] = [];
        acc[sid].push(ticket);
        return acc;
      }, {});

      setTicketsGrouped(grouped);
      setLoading(false);
    };
    fetchData();
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
        {!loading && Object.keys(ticketsGrouped).length === 0 ? (
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
            {Object.entries(ticketsGrouped).map(([showtimeId, tickets]) => {
              const showtime = tickets[0].showtime;
              const seats = tickets.map(t => t.seat.row + t.seat.seat_number);
              const total = tickets.reduce((sum) => sum + showtime.price, 0);
              const purchaseDate = tickets[0].purchase_date;

              return (
                <motion.div
                  key={showtimeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/70 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all shadow-lg"
                >
                  {/* Encabezado del ticket */}
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-400">Código #{showtime.id}</span>
                      <h3 className="text-xl font-bold truncate max-w-[200px] sm:max-w-none">
                        {showtime.movie.title}
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${showtime.format === "IMAX"
                      ? "bg-purple-600/30 text-purple-300"
                      : "bg-cyan-600/30 text-cyan-300"
                      }`}>
                      {showtime.format}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-1/3 flex-shrink-0">
                      <img
                        src={showtime.movie.url_poster}
                        alt={showtime.movie.title}
                        className="rounded-lg w-full h-auto object-cover shadow-md"
                      />
                    </div>

                    <div className="w-full">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-indigo-400 mb-2">
                          Detalles de la función
                        </h4>
                        <div className="space-y-2">
                          <p className="flex items-center text-gray-300">
                            <FiCalendar className="mr-2 text-indigo-500" />
                            {formatDate(showtime.start_time.toString())}
                          </p>
                          <p className="flex items-center text-gray-300">
                            <FiMapPin className="mr-2 text-indigo-500" />
                            {showtime.room.name}
                          </p>
                          <p className="flex items-center text-gray-300">
                            <FaTicketAlt className="mr-2 text-indigo-500" />
                            Asientos: {seats.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-400">Precio total</span>
                          <p className="text-2xl font-bold text-yellow-400">
                            S/.{total.toFixed(2)}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">
                          Ver QR
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-gray-900/50 text-xs text-gray-400 border-t border-gray-800">
                    Comprado el {formatDate(purchaseDate?.toString() || "")}
                  </div>
                </motion.div>
              );
            })}

          </div>
        )}
      </main>
    </div>
  );
}