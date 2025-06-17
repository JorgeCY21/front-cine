import { Link } from 'react-router-dom';
import { FaFilm, FaUser, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <FaFilm className="text-2xl" />
          <span className="text-xl font-bold">CineReact</span>
        </Link>
        
        <div className="flex space-x-6">
          <Link to="/movies" className="hover:text-yellow-300 transition-colors">Películas</Link>
          <Link to="/profile" className="hover:text-yellow-300 transition-colors">Mi Cuenta</Link>
          <Link to="/cart" className="flex items-center hover:text-yellow-300 transition-colors">
            <FaShoppingCart className="mr-1" /> Carrito
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;