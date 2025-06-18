import { FiClock, FiPlay, FiStar } from "react-icons/fi";
import { useRef, useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  duration: number;
  description: string;
  genre: string;
  rating: number;
  posterUrl: string;
  trailerUrl: string;
};

interface Props {
  movie: Movie;
  onSelect: (id: number) => void;
}

export default function MovieCard({ movie, onSelect }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && iframeRef.current) {
      iframeRef.current.src = movie.trailerUrl;
    } else if (iframeRef.current) {
      iframeRef.current.src = "";
    }
  }, [isHovered, movie.trailerUrl]);

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition hover:-translate-y-2 hover:shadow-xl cursor-pointer relative"
      onClick={() => onSelect(movie.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 w-full">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={movie.title}
          />
        </div>
        <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex items-center text-yellow-400 text-sm">
          <FiStar className="mr-1" /> {movie.rating}
        </div>
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border-2 border-white/50">
              <FiPlay className="text-white text-2xl" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{movie.genre}</span>
          <span className="flex items-center">
            <FiClock className="mr-1" />
            {movie.duration} min
          </span>
        </div>
        <p className="text-gray-300 text-sm line-clamp-2">
          {movie.description}
        </p>
        <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition">
          Ver Horarios
        </button>
      </div>
    </div>
  );
}
