import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiArrowLeft } from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { TicketDto } from "../dto/ticket.dto";
import { misTickets } from "../services/tickets.service";
import { ShowtimeDto } from "../dto/showtime.dto";
import { SeatDto } from "../dto/seat.dto";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState<string[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      // Simulación de datos (en un caso real, harías una petición a tu API)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const mockTickets: TicketDto[] = await misTickets(user.id)
      const seatsGenerado: SeatDto[] = generateSeats(mockTickets[0].showtime)

      const total = mockTickets.reduce((sum, ticket) => {
        const seat = seatsGenerado.find(s => s.id === ticket.seat.id);
        return seat ? sum + seat.price : sum;
      }, 0);
      
      const seats: string[] = mockTickets.map(t => t.seat.row + t.seat.seat_number)
      setSeats(seats)
      setTotal(total)


      setTimeout(() => {
        setTickets(mockTickets);
        setLoading(false);
      }, 1000);
    }
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

  function generateSeats(showtime: ShowtimeDto): SeatDto[] {
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

    const seats: SeatDto[] = [];

    rows.forEach((rowLetter, rowIndex) => {
      for (let num = 1; num <= seatsPerRow; num++) {
        seats.push({
          id: rowIndex * seatsPerRow + num,
          seat_number: num,
          row: rowLetter,
          available: false,
          type: typePerRow[rowIndex],
          price: prices[typePerRow[rowIndex]],
        });
      }
    });

    return seats;
  }

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
                      {ticket.showtime.movie.title}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.showtime.format === "IMAX"
                    ? "bg-purple-600/30 text-purple-300"
                    : "bg-cyan-600/30 text-cyan-300"
                    }`}>
                    {ticket.showtime.format}
                  </span>
                </div>

                {/* Contenido del ticket */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                  {/* Poster */}
                  <div className="w-full sm:w-1/3 flex-shrink-0">
                    <img
                      src={ticket.showtime.movie.url_poster}
                      alt={ticket.showtime.movie.title}
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
                          {formatDate(ticket.showtime.start_time.toString())}
                        </p>
                        <p className="flex items-center text-gray-300">
                          <FiMapPin className="mr-2 text-indigo-500" />
                          {ticket.showtime.room.name}
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

                {/* Footer del ticket */}
                <div className="px-4 py-3 bg-gray-900/50 text-xs text-gray-400 border-t border-gray-800">
                  Comprado el {formatDate(ticket.purchase_date?.toString() || "")}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}