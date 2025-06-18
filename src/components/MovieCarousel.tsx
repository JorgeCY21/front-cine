import { FiChevronLeft, FiChevronRight, FiClock, FiStar } from "react-icons/fi";

type Movie = {
  id: number;
  title: string;
  duration: number;
  description: string;
  genre: string;
  rating: number;
  posterUrl: string;
  backdropUrl: string;
};

interface Props {
  movie: Movie;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (id: number) => void;
}

export default function MovieCarousel({ movie, onPrev, onNext, onSelect }: Props) {
  return (
    <div 
      className="relative h-120 w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${movie.backdropUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 flex items-center">
        <button onClick={onPrev} className="absolute left-4 bg-black/50 rounded-full p-2 hover:bg-black/70 z-10 cursor-pointer">
          <FiChevronLeft className="text-2xl" />
        </button>

        <div className="container mx-auto px-6 z-10 flex items-center">
          <div className="w-1/3 hidden md:block">
            <img src={movie.posterUrl} alt={movie.title} className="rounded-lg shadow-2xl w-64 transform hover:scale-105 transition" />
          </div>
          <div className="md:w-2/3 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-yellow-400"><FiStar className="mr-1" /> {movie.rating}</span>
              <span className="flex items-center"><FiClock className="mr-1" /> {movie.duration} min</span>
              <span className="bg-indigo-600 px-2 py-1 rounded text-sm">{movie.genre}</span>
            </div>
            <p className="text-gray-300 max-w-2xl">{movie.description}</p>
            <button onClick={() => onSelect(movie.id)} className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg cursor-pointer">
              Ver Horarios
            </button>
          </div>
        </div>

        <button onClick={onNext} className="absolute right-4 bg-black/50 rounded-full p-2 hover:bg-black/70 z-10 cursor-pointer">
          <FiChevronRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
}
