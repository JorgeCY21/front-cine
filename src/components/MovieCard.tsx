import { FiClock, FiPlay, FiStar } from "react-icons/fi";
import { useRef, useEffect, useState } from "react";
import { MovieDto } from "../dto/movie.dto";

interface Props {
  movie: MovieDto;
  onSelect: (id: number) => void;
}

export default function MovieCard({ movie, onSelect }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Solo cargar el trailer en hover si no es móvil
    if (!isMobile && isHovered && iframeRef.current) {
      iframeRef.current.src = movie.url_trailer ?? '';
    } else if (iframeRef.current) {
      iframeRef.current.src = "";
    }
  }, [isHovered, movie.url_trailer, isMobile]);

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative"
      onClick={() => onSelect(movie.id)}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Contenedor de imagen/trailer */}
      <div className="relative pb-[150%]"> {/* Mantener relación de aspecto 2:3 */}
        {/* Imagen del póster */}
        <img
          src={movie.url_poster}
          alt={movie.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            (isMobile || !isHovered) ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
        
        {/* Trailer (solo en desktop) */}
        {!isMobile && (
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full object-cover"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Trailer de ${movie.title}`}
            />
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex items-center text-yellow-400 text-xs sm:text-sm">
          <FiStar className="mr-1" /> {movie.rating}
        </div>

        {/* Overlay de play (solo cuando no hay hover en desktop) */}
        {(!isHovered || isMobile) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 border-2 border-white/50">
              <FiPlay className="text-white text-xl sm:text-2xl" />
            </div>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-2" title={movie.title}>
          {movie.title}
        </h3>
        
        <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
          <span className="truncate max-w-[50%]">{movie.genre}</span>
          <span className="flex items-center whitespace-nowrap">
            <FiClock className="mr-1" />
            {movie.duration} min
          </span>
        </div>
        
        <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
          {movie.description}
        </p>
        
        <button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1 sm:py-2 rounded transition text-xs sm:text-sm md:text-base cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(movie.id);
          }}
        >
          Ver Horarios
        </button>
      </div>
    </div>
  );
}