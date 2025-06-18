import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiClock, FiMapPin, FiCalendar, FiChevronLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

type Showtime = {
  id: number;
  movieId: number;
  roomName: string;
  startTime: string;
  format: string;
  price: number;
  seatsAvailable: number;
};

type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  duration: number;
  genre: string;
};

export default function ShowtimesPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    // Simulación de datos de película
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: "Interstellar",
        posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        duration: 169,
        genre: "Ciencia ficción"
      },
      {
        id: 2,
        title: "Inception",
        posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        duration: 148,
        genre: "Thriller psicológico"
      },
      {
        id: 3,
        title: "The Dark Knight",
        posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        duration: 152,
        genre: "Acción"
      }
    ];
    
    // Simulación de funciones
    const mockShowtimes: Showtime[] = [
      { id: 1, movieId: 1, roomName: "Sala IMAX", startTime: "2025-06-18T16:00:00", format: "IMAX 3D", price: 12.99, seatsAvailable: 45 },
      { id: 2, movieId: 1, roomName: "Sala Premium", startTime: "2025-06-18T19:30:00", format: "4K Dolby Atmos", price: 14.99, seatsAvailable: 32 },
      { id: 3, movieId: 1, roomName: "Sala Estándar", startTime: "2025-06-18T21:00:00", format: "2K Digital", price: 9.99, seatsAvailable: 78 },
      { id: 4, movieId: 1, roomName: "Sala IMAX", startTime: "2025-06-19T15:00:00", format: "IMAX 3D", price: 12.99, seatsAvailable: 52 },
      { id: 5, movieId: 1, roomName: "Sala Premium", startTime: "2025-06-19T18:30:00", format: "4K Dolby Atmos", price: 14.99, seatsAvailable: 28 },
      { id: 6, movieId: 1, roomName: "Sala VIP", startTime: "2025-06-19T21:45:00", format: "4K Luxury", price: 19.99, seatsAvailable: 24 },
    ];

    const currentMovie = mockMovies.find(m => m.id === Number(movieId));
    setMovie(currentMovie || null);

    const filtered = mockShowtimes.filter(s => s.movieId === Number(movieId));
    setShowtimes(filtered);
  }, [movieId]);

  const handleSelect = (showtimeId: number) => {
    navigate(`/seats/${showtimeId}`);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getDatesForWeek = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const groupShowtimesByDate = () => {
    const grouped: Record<string, Showtime[]> = {};
    
    showtimes.forEach(showtime => {
      const date = new Date(showtime.startTime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(showtime);
    });
    
    return grouped;
  };

  const groupedShowtimes = groupShowtimesByDate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 shadow-lg">
        <div className="container mx-auto flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-700 transition"
          >
            <FiChevronLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold">CineMax Premium</h1>
        </div>
      </header>

      {/* Movie Info Section */}
      {movie && (
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-start">
          <div className="md:w-1/4 mb-6 md:mb-0 md:pr-8">
            <img 
              src={movie.posterUrl} 
              alt={movie.title}
              className="rounded-lg shadow-xl w-full max-w-xs"
            />
          </div>
          <div className="md:w-3/4">
            <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-gray-400">{movie.genre}</span>
              <span className="flex items-center text-gray-400">
                <FiClock className="mr-1" /> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </span>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-3 text-indigo-400">Selecciona una fecha y función</h3>
              
              {/* Date Selector */}
              <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {getDatesForWeek().map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center px-4 py-2 mx-1 rounded-lg min-w-16 transition cursor-pointer ${date.toDateString() === selectedDate.toDateString() ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    <span className="text-sm font-medium">
                      {date.toLocaleDateString([], { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-bold">
                      {date.getDate()}
                    </span>
                  </button>
                ))}
              </div>

              {/* Showtimes */}
              {Object.entries(groupedShowtimes).map(([date, showtimesForDate]) => {
                const showDate = new Date(date);
                if (showDate.toDateString() !== selectedDate.toDateString()) return null;
                
                return (
                  <motion.div 
                    key={date}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xl font-semibold flex items-center">
                      <FiCalendar className="mr-2 text-indigo-400" />
                      {formatDay(date)}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {showtimesForDate.map(showtime => (
                        <motion.div
                          key={showtime.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelect(showtime.id)}
                          className="bg-gray-700 rounded-xl p-4 cursor-pointer border border-gray-600 hover:border-indigo-500 transition group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-lg font-bold group-hover:text-indigo-400 transition">
                              {showtime.roomName}
                            </h5>
                            <span className="bg-indigo-600 text-xs px-2 py-1 rounded-full">
                              {showtime.format}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="flex items-center text-gray-300">
                              <FiClock className="mr-1" /> {formatTime(showtime.startTime)}
                            </span>
                            <span className="flex items-center text-gray-300">
                              <FiMapPin className="mr-1" /> {showtime.seatsAvailable} asientos
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">
                              Precio desde
                            </span>
                            <span className="text-xl font-bold text-yellow-400">
                              S/.{showtime.price.toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}