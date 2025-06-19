import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiClock, FiMapPin, FiCalendar, FiChevronLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { getMovieById } from "../services/movies.service";
import { MovieDto } from "../dto/movie.dto";
import { ShowtimeDto } from "../dto/showtime.dto";
import { getShowtimeByMovieId } from "../services/showtimes.service";

/* type Showtime = {
  id: number;
  movieId: number;
  roomName: string;
  startTime: string;
  format: string;
  price: number;
  seatsAvailable: number;
}; */

export default function ShowtimesPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [movie, setMovie] = useState<MovieDto | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const currentMovie = await getMovieById(movieId ?? '1');
      if (!currentMovie) return;

      setMovie(currentMovie);

      const showTimes = await getShowtimeByMovieId(movieId ?? '1')
      setShowtimes(showTimes);
    }
    fetchData();
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
    const grouped: Record<string, ShowtimeDto[]> = {};

    showtimes.forEach(showtime => {
      const date = new Date(showtime.start_time).toDateString();
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
      {/* Header simplificado */}
      <header className="bg-gray-800 py-3 px-4 sm:py-4 sm:px-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-2 sm:mr-4 p-1 sm:p-2 rounded-full hover:bg-gray-700 transition"
            aria-label="Volver"
          >
            <FiChevronLeft className="text-lg sm:text-xl" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold truncate max-w-[70vw] sm:max-w-none">
            {movie?.title || "CineMax Premium"}
          </h1>
        </div>
      </header>

      {/* Movie Info Section */}
      {movie && (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-6">
          {/* Poster - Solo en desktop o en versión vertical en móviles */}
          <div className="w-full lg:w-1/4 flex justify-center lg:justify-start lg:pr-8">
            <img
              src={movie.url_poster}
              alt={movie.title}
              className="rounded-lg shadow-xl w-full max-w-[200px] sm:max-w-xs lg:max-w-full"
            />
          </div>

          {/* Showtimes Content */}
          <div className="w-full lg:w-3/4">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{movie.title}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base">
                <span className="text-gray-400">{movie.genre}</span>
                <span className="flex items-center text-gray-400">
                  <FiClock className="mr-1" /> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              </div>
            </div>

            <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-indigo-400">
                Selecciona una fecha y función
              </h3>

              {/* Date Selector - Scroll horizontal en móviles */}
              <div className="flex overflow-x-auto pb-3 mb-4 sm:mb-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <div className="flex space-x-2 sm:space-x-3">
                  {getDatesForWeek().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg min-w-[60px] sm:min-w-[70px] transition cursor-pointer ${date.toDateString() === selectedDate.toDateString()
                        ? 'bg-indigo-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    >
                      <span className="text-xs sm:text-sm font-medium">
                        {date.toLocaleDateString([], { weekday: 'short' })}
                      </span>
                      <span className="text-base sm:text-lg font-bold">
                        {date.getDate()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Showtimes Grid */}
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
                    <h4 className="text-lg sm:text-xl font-semibold flex items-center">
                      <FiCalendar className="mr-2 text-indigo-400" />
                      {formatDay(date)}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {showtimesForDate.map(showtime => (
                        <motion.div
                          key={showtime.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelect(showtime.id)}
                          className="bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer border border-gray-600 hover:border-indigo-500 transition group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-base sm:text-lg font-bold group-hover:text-indigo-400 transition truncate max-w-[70%]">
                              {showtime.room.name}
                            </h5>
                            <span className="bg-indigo-600 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                              {showtime.format}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm mb-2 sm:mb-3">
                            <span className="flex items-center text-gray-300">
                              <FiClock className="mr-1" /> {formatTime(showtime.start_time.toString())}
                            </span>
                            <span className="flex items-center text-gray-300">
                              <FiMapPin className="mr-1" /> {showtime.room.capacity} asientos
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-xs sm:text-sm">
                              Precio desde
                            </span>
                            <span className="text-lg sm:text-xl font-bold text-yellow-400">
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