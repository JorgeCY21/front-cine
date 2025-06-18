import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiLogOut, FiStar, FiClock } from 'react-icons/fi';
import { FaTicketAlt } from 'react-icons/fa';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
   <header className={`sticky top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md py-2 shadow-xl' : 'bg-gradient-to-b from-gray-900/80 to-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo y navegación */}
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              CineMax
            </div>
            <span className="ml-1 text-xs text-purple-400">PREMIUM</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/movies" className="text-white hover:text-indigo-300 transition flex items-center">
              <FiStar className="mr-1" /> Cartelera
            </Link>
            <Link to="/upcoming" className="text-gray-300 hover:text-white transition flex items-center">
              <FiClock className="mr-1" /> Próximamente
            </Link>
            <Link to="/my-tickets" className="text-gray-300 hover:text-white transition flex items-center">
              <FaTicketAlt className="mr-1" /> Mis entradas
            </Link>
          </nav>
        </div>

        {/* Barra de búsqueda y acciones de usuario */}
        <div className="flex items-center space-x-4">
          <div className={`relative transition-all duration-300 ${isScrolled ? 'w-48' : 'w-64'}`}>
            <input
              type="text"
              placeholder="Buscar películas..."
              className="w-full bg-gray-800/70 border border-gray-700 rounded-full py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <button className="p-2 text-gray-300 hover:text-white relative">
            <FiBell className="text-xl" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                {user.email ? user.email.charAt(0).toUpperCase() : <FiUser />}
              </div>
              <span className="hidden md:inline text-white">{user.email || 'Usuario'}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setShowDropdown(false)}
                >
                  Mi perfil
                </Link>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setShowDropdown(false)}
                >
                  Configuración
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center"
                >
                  <FiLogOut className="mr-2" /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;