import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiMapPin, FiFilm, FiArrowLeft } from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Footer from "../components/Footer";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedSeats = JSON.parse(localStorage.getItem("selectedSeats") || "[]") as number[];
    const storedShowtimeId = localStorage.getItem("showtimeId");

    if (!storedShowtimeId || storedSeats.length === 0) {
      navigate("/movies");
      return;
    }

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

  const handleFinish = async () => {
  setIsCompleting(true);

  setTimeout(async () => {
    try {
      const element = document.getElementById("pdf-ticket-summary");
      
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        logging: true,
        backgroundColor: '#ffffff',
        useCORS: true
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 120] // Tamaño similar a ticket real
      });

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 80, 120);
      pdf.save(`CineMax_${showtime?.movieTitle}_Ticket.pdf`);

      // Limpiar y redirigir
      localStorage.removeItem("selectedSeats");
      localStorage.removeItem("showtimeId");
      navigate("/movies");
    } catch (error) {
      console.error("Error al generar el ticket:", error);
      setIsCompleting(false);
    }
  }, 1000);
};

  const getSeatBadgeColor = (type: string) => {
    switch(type) {
      case "vip": return "bg-gradient-to-br from-yellow-500 to-yellow-600";
      case "premium": return "bg-gradient-to-br from-indigo-500 to-purple-600";
      default: return "bg-gradient-to-br from-green-500 to-green-600";
    }
  };

  // Añade esto en tu componente para cargar la fuente del código de barras
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-black/50 backdrop-blur-md py-4 px-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition  cursor-pointer"
          >
            <FiArrowLeft className="mr-2" /> Volver
          </button>
          <h1 className="text-xl font-bold">Confirmación de Compra</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <div id="ticket-summary" className="container mx-auto px-4 py-8 max-w-4xl bg-gray-900 text-white rounded-xl shadow-xl">

        {/* Header de éxito */}
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

        {/* Información película y asientos */}
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
                    <FiClock className="text-indigo-400 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-400 text-sm">Fecha y Hora</p>
                      <p className="font-medium">
                        {new Date(showtime.startTime).toLocaleDateString('es-ES', { 
                          weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiMapPin className="text-indigo-400 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-400 text-sm">Sala</p>
                      <p className="font-medium">{showtime.roomName}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiFilm className="text-indigo-400 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-400 text-sm">Formato</p>
                      <p className="font-medium">{showtime.format}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaTicketAlt className="text-indigo-400 mt-1 mr-3" />
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

        {/* Asientos y total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <FaTicketAlt className="text-indigo-400 mr-2" />
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
            <p className="text-3xl font-bold text-yellow-400">S/.{calculateTotal().toFixed(2)}</p>
          </div>
        </motion.div>

        {/* Botón Confirmar */}
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
            className={`relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg w-full max-w-md mx-auto cursor-pointer ${
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

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 text-white rounded-xl p-8 max-w-md w-full text-center border border-gray-700 shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <FiCheckCircle className="text-green-400 text-5xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Compra Confirmada!</h2>
              <p className="text-gray-300 mb-6">Gracias por tu compra. Disfruta tu película.</p>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  navigate("/movies");
                }}
                className="mt-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold transition cursor-pointer"
              >
                Volver al inicio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Ticket premium con diseño atractivo */}
      <div 
        id="pdf-ticket-summary" 
        style={{
          position: 'absolute',
          left: '-9999px', // Mueve el elemento fuera del viewport
          top: 0,
          display: 'block', // Asegura que html2canvas pueda capturarlo
          // Mantén el resto de tus estilos existentes
          width: '80mm',
          padding: '5mm',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          color: '#2d3748',
          fontFamily: '"Segoe UI", Roboto, sans-serif',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Banda decorativa superior */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '8px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
        }}></div>
        
        {/* Encabezado */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px dashed #cbd5e0'
        }}>
          <div style={{ 
            fontWeight: '800', 
            fontSize: '16px',
            color: '#4a5568',
            letterSpacing: '1px',
            marginBottom: '4px'
          }}>CINEMAX <span style={{ color: '#667eea' }}>PREMIUM</span></div>
          <div style={{ 
            fontSize: '8px',
            color: '#718096',
            letterSpacing: '0.5px'
          }}>EXPERIENCE</div>
        </div>
        
        {/* Contenido principal */}
        <div style={{ 
          background: 'white',
          borderRadius: '6px',
          padding: '10px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          marginBottom: '12px'
        }}>
          {/* Fila de película */}
          <div style={{ 
            display: 'flex',
            marginBottom: '8px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              marginRight: '10px',
              flexShrink: '0'
            }}>
              {showtime?.movieTitle.charAt(0)}
            </div>
            <div style={{ flexGrow: '1' }}>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '12px',
                color: '#4a5568'
              }}>{showtime?.movieTitle}</div>
              <div style={{ 
                fontSize: '9px',
                color: '#718096'
              }}>{showtime?.format}</div>
            </div>
          </div>
          
          {/* Detalles */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            fontSize: '10px'
          }}>
            <div>
              <div style={{ color: '#718096', fontSize: '8px' }}>FECHA</div>
              <div style={{ fontWeight: '500' }}>
                {new Date(showtime?.startTime || "").toLocaleString('es-ES', { 
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit' 
                })}
              </div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '8px' }}>SALA</div>
              <div style={{ fontWeight: '500' }}>{showtime?.roomName}</div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '8px' }}>ASIENTOS</div>
              <div style={{ fontWeight: '500' }}>
                {seats.map(s => `${s.row}${s.seatNumber}`).join(', ')}
              </div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '8px' }}>TOTAL</div>
              <div style={{ 
                fontWeight: '600',
                color: '#667eea'
              }}>S/. {calculateTotal().toFixed(2)}</div>
            </div>
          </div>
        </div>
        
        {/* Código de barras premium */}
        <div style={{ 
          textAlign: 'center',
          margin: '12px 0',
          position: 'relative'
        }}>
          <div style={{
            fontFamily: '"Libre Barcode 128", cursive',
            fontSize: '36px',
            letterSpacing: '2px',
            color: '#2d3748',
            padding: '6px 0',
            background: 'white',
            borderRadius: '4px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
          }}>
            {`CINEMX${Math.floor(Math.random() * 90000) + 10000}`}
          </div>
          <div style={{ 
            fontSize: '8px',
            color: '#718096',
            marginTop: '4px',
            letterSpacing: '1px'
          }}>
            TICKET ID: {Date.now().toString().slice(-8)}
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '7px',
          color: '#a0aec0',
          borderTop: '1px dashed #e2e8f0',
          paddingTop: '8px'
        }}>
          <div>Presentar este ticket en taquilla</div>
          <div>Válido solo para la función indicada</div>
          <div style={{ marginTop: '4px' }}>www.cinemax-premium.com</div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
